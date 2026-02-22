import { searchMySodimas } from '../lib/connectors/mysodimas'

async function test() {
  try {
    const results = await searchMySodimas('5300')
    console.log('MySodimas results:', results)
  } catch (err) {
    console.error('Test failed:', err)
  }
}

test()