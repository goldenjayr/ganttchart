import React, { Component, useState, useMemo, useRef } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import faker from 'faker'

import Timeline, {
  SidebarHeader,
  TimelineHeaders,
  CustomHeader,
  DateHeader,
  CursorMarker,
  TimelineMarkers
} from 'react-calendar-timeline'
// import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container'
import 'react-calendar-timeline/lib/Timeline.css'
import { Box } from './Box'
import { Dustbin } from './Dustbin'
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

const { groups, items, data, reservations } = generateFakeData(5, 400)
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

  const reservationColumn = useMemo(
    () => [
      {
        Header: 'Unassigned Reservations',
        columns: [
          {
            Header: 'Res ID',
            accessor: 'res_id'
          },
          {
            Header: 'Date',
            accessor: 'date'
          },
          {
            Header: 'Time',
            accessor: 'time'
          },
          {
            Header: 'Guest',
            accessor: 'guest'
          }
        ]
      }
    ],
    []
  )

  const { headerGroups, rows, prepareRow } = useTable({
    columns: vehicleColumns,
    data
  })

  const {
    headerGroups: reservationGroups,
    rows: reservationRow,
    prepareRow: prepareRow2
  } = useTable({
    columns: reservationColumn,
    data: reservations
  })

  const groups = useMemo(() => {
    console.log('RESERVATION', reservationRow)
    return rows.map((row, i) => {
      prepareRow(row)
      const rightSideRow = reservationRow.find((item, index) => index === i)
      prepareRow2(rightSideRow)
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
        ),
        rightTitle: (
          <Box className='side-header--label'>
              {rightSideRow.cells.map((cell) => {
                return (
                  <div {...cell.getCellProps()} className='side-header--label-item'>
                    {cell.render('Cell')}
                  </div>
                )
              })}
          </Box>
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
        rightSidebarWidth={500}
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
        rightSidebarWidth={500}
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
        onCanvasClick={(groupID, time, e) => {
          if (!(e.nativeEvent instanceof PointerEvent)) {
            setState((state) => {
              const endValue = moment(time + faker.datatype.number({ min: 2, max: 20 }) * 15 * 60 * 1000).valueOf()
              return {
                ...state,
                items2: [
                  ...state.items2,
                  {
                    id: state.items2.length + 1,
                    group: groupID,
                    title: 'DONGJE',
                    start: time,
                    end: endValue,
                    className: moment(endValue).day() === 6 || moment(endValue).day() === 0 ? 'item-weekend' : '',
                    itemProps: {
                      'data-tip': faker.hacker.phrase()
                    }
                  }
                ]
              }
            })
          }
        }}
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
        rightSidebarWidth={500}
        rightSidebarContent={<div>Hello</div>}
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
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()} className='side-header'>
                  <div>
                    {reservationGroups.map((headerGroup) => {
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
        </TimelineHeaders>
      </Timeline>
    )
  }

  return (
    <div className={className}>
      <DndProvider backend={HTML5Backend}>
        <Dustbin>
          {renderFirst(state)}
          {renderSecond(state)}
          {renderThird(state)}
        </Dustbin>
      </DndProvider>
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
