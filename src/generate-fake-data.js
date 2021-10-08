import faker from 'faker'
import namor from 'namor'
import randomColor from 'randomcolor'
import moment from 'moment'

export default function createData (groupCount = 30, itemCount = 1000, daysInPast = 30) {
  let randomSeed = Math.floor(Math.random() * 1000)
  let groups = []
	const data = []
  for (let i = 0; i < groupCount; i++) {
		const id = `${i + 1}`
		const name = namor.generate({ words: 1, numbers: 0 })
    groups.push({
      id,
      title: <div>{name}</div>,
      rightTitle: faker.name.lastName()
      // bgColor: randomColor({ luminosity: 'light', seed: randomSeed + i })
    })
		data.push({
			unit: Math.floor(Math.random() * 30),
			odometer: Math.floor(Math.random() * 100),
			location: namor.generate({ words: 1, numbers: 0 }),
			year: Math.floor(Math.random() * 1000),
			make: namor.generate({ words: 1, numbers: 0}),
			model: namor.generate({ words: 1, number: 2 })
		})
  }

  let items = []
  for (let i = 0; i < itemCount; i++) {
    const startDate = faker.date.recent(daysInPast).valueOf() + daysInPast * 0.3 * 86400 * 1000
    const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000
    const endValue = moment(startDate + faker.datatype.number({ min: 2, max: 20 }) * 15 * 60 * 1000).valueOf()

    items.push({
      id: i + '',
      group: faker.datatype.number({ min: 1, max: groups.length }) + '',
      title: faker.hacker.phrase(),
      start: startValue,
      end: endValue,
      // canMove: startValue > new Date().getTime(),
      // canResize: startValue > new Date().getTime() ? (endValue > new Date().getTime() ? 'both' : 'left') : (endValue > new Date().getTime() ? 'right' : false),
      className: moment(startDate).day() === 6 || moment(startDate).day() === 0 ? 'item-weekend' : '',
      itemProps: {
        'data-tip': faker.hacker.phrase()
      }
    })
  }

  items = items.sort((a, b) => b - a)

  return { groups, items, data }
}
