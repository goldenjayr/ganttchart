import React, { Component, useState, useMemo, useRef } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useTable } from 'react-table'

import Timeline, { SidebarHeader, TimelineHeaders, CustomHeader, DateHeader } from 'react-calendar-timeline'
// import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container'
import 'react-calendar-timeline/lib/Timeline.css'

import generateFakeData from './generate-fake-data'

var keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end',
  groupLabelKey: 'title'
}

const vehicleHeader = [
  {
    id: 'unit',
    label: 'Unit'
  },
  {
    id: 'odometer',
    label: 'Odometer'
  },
  {
    id: 'location',
    label: 'Location'
  },
  {
    id: 'year',
    label: 'Year'
  },
  {
    id: 'make',
    label: 'Make'
  },
  {
    id: 'model',
    label: 'Model'
  }
]

const { groups, items, data } = generateFakeData(5, 400)
const { groups: groups2, items: items2 } = generateFakeData(5, 400)

const visibleTimeStart = moment().startOf('day').valueOf()
const visibleTimeEnd = moment().startOf('day').add(1, 'day').valueOf()

function GanntChart({ className }) {
  const vehicleColumns = useMemo(
    () => [
      {
        Header: 'Vehicle',
        columns: [
          {
            Header: 'Unit',
            accessor: 'unit'
          },
          {
            Header: 'Odometer',
            accessor: 'odometer'
          },
          {
            Header: 'Location',
            accessor: 'location'
          },
          {
            Header: 'Year',
            accessor: 'year'
          },
          {
            Header: 'Make',
            accessor: 'make'
          },
          {
            Header: 'Model',
            accessor: 'model'
          }
        ]
      }
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: vehicleColumns,
    data
  })

  const groups = useMemo(() => {
    return rows.map((row, i) => {
      prepareRow(row)
      const { key } = row.getRowProps()
      return {
        id: i,
        title: (
          <div className='side-header--label'>
            {row.cells.map((cell) => {
              return (
                <div {...cell.getCellProps()} className='side-header--label-item'>
                  {cell.render('Cell')}
                </div>
              )
            })}
          </div>
        )
      }
    })
  }, [])
  const [state, setState] = useState({
    groups,
    items,
    groups2,
    items2,
    visibleTimeStart,
    visibleTimeEnd
  })

  const [isOpen, setIsOpen] = useState(true)
  const [isThirdOpen, setIsThirdOpen] = useState(true)

  const handleTimeChangeFirst = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    console.log('first', visibleTimeStart, visibleTimeEnd)
    setState((state) => ({ ...state, visibleTimeStart, visibleTimeEnd }))
  }
  const handleTimeChangeSecond = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    setState((state) => ({ ...state, visibleTimeStart, visibleTimeEnd }))
  }

  const handleItemResize = (itemId, time, edge) => {
    setState((state) => {
      const { items } = state
      return {
        ...state,
        items: items.map((item) =>
          item.id === itemId
            ? Object.assign({}, item, {
                start: edge === 'left' ? time : item.start,
                end: edge === 'left' ? item.end : time
              })
            : item
        )
      }
    })
  }
  const handleItemMove = (itemId, dragTime, newGroupOrder) => {


    setState((state) => {
			const { items, groups } = state
			const group = groups[newGroupOrder]
      return {
        ...state,
        items: items.map((item) =>
          item.id === itemId
            ? Object.assign({}, item, {
                start: dragTime,
                end: dragTime + (item.end - item.start),
                group: group.id
              })
            : item
        )
      }
    })
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleThirdClick = () => {
    setIsThirdOpen(!isThirdOpen)
  }
  const renderThird = (state) => {
    const { groups, items2, visibleTimeStart, visibleTimeEnd } = state

    return (
      <Timeline
        groups={isThirdOpen ? groups : []}
        items={items2}
        keys={keys}
        sidebarWidth={600}
        rightSidebarWidth={150}
        rightSidebarContent={<div>Above The Right</div>}
        canMove={true}
        canResize={'both'}
        canSelect
        itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        onTimeChange={handleTimeChangeFirst}
        onItemResize={handleItemResize}
				onItemMove={handleItemMove}
      >
        <TimelineHeaders>
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()} className='side-header' onClick={handleThirdClick}>
                  Third
                </div>
              )
            }}
          </SidebarHeader>
          <CustomHeader height={50}>
            {() => {
              return <div style={{ height: 30 }}></div>
            }}
          </CustomHeader>
        </TimelineHeaders>
      </Timeline>
    )
  }

  const renderSecond = (state) => {
    const { groups, items2, visibleTimeStart, visibleTimeEnd } = state

    return (
      <Timeline
        groups={isOpen ? groups : []}
        items={items2}
        keys={keys}
        sidebarWidth={600}
        rightSidebarWidth={150}
        rightSidebarContent={<div>Above The Right</div>}
        canMove={true}
        canResize={'both'}
        canSelect
        itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        onTimeChange={handleTimeChangeFirst}
        onItemResize={handleItemResize}
				onItemMove={handleItemMove}
      >
        <TimelineHeaders>
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()} className='side-header' onClick={handleClick}>
                  Second
                </div>
              )
            }}
          </SidebarHeader>
          <CustomHeader height={50}>
            {() => {
              return <div style={{ height: 30 }}></div>
            }}
          </CustomHeader>
        </TimelineHeaders>
      </Timeline>
    )
  }

  const renderFirst = (state) => {
    const { groups, items, visibleTimeStart, visibleTimeEnd } = state

    return (
      <Timeline
        groups={[]}
        items={items}
        keys={keys}
        sidebarWidth={600}
        rightSidebarWidth={150}
        canMove
        canResize='right'
        canSelect
        itemsSorted
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        onTimeChange={handleTimeChangeSecond}
      >
        <TimelineHeaders>
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()} className='side-header'>
                  <div>
                    {headerGroups.map((headerGroup) => {
                      return (
                        <div {...headerGroup.getHeaderGroupProps()} className='side-header--label'>
                          {headerGroup.headers.map((column) => {
                            return (
                              <div {...column.getHeaderProps()} className='side-header--label-item'>
                                {column.render('Header')}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }}
          </SidebarHeader>
          <DateHeader unit='primaryHeader' />
          <DateHeader />
          <SidebarHeader variant='right' headerData={{ someData: 'extra' }}>
            {({ getRootProps, data }) => {
              return <div {...getRootProps()}>Unassigned Reservations</div>
            }}
          </SidebarHeader>
        </TimelineHeaders>
      </Timeline>
    )
  }

  return (
    <div className={className}>
      {renderFirst(state)}
      {renderSecond(state)}
      {renderThird(state)}
    </div>
  )
}

export default styled(GanntChart)`
  .side-header {
    color: white;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .side-header--label {
    display: flex;
    justify-content: space-between;
  }

  .side-header--label-item {
    border: 1px solid white;
    padding: 5px;
    width: 100%;
    text-align: center;
    overflow-wrap: break-word;
    height: auto;
    white-space: normal;
    line-height: normal;
  }
`
