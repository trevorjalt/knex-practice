const { expect } = require("chai")
const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping List service object`, function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'Avocado',
            price: '5.00',
            category: 'Main',
            checked: false,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            
        },
        {
            id: 2,
            name: 'Bananas',
            price: '3.50',
            category: 'Breakfast',
            checked: true,
            date_added: new Date('2027-02-22T16:28:32.615Z'),
            
        },
        {
            id: 3,
            name: 'Apples',
            price: '1.30',
            category: 'Lunch',
            checked: false,
            date_added: new Date('2023-12-22T16:28:32.615Z'),
            
        },
        {
            id: 4,
            name: 'Oranges',
            price: '8.00',
            category: 'Snack',
            checked: false,
            date_added: new Date('2019-01-17T16:28:32.615Z'),
            
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getById() resolves an article by id from 'shopping_list' table`, () => {
            const secondId = 2
            const secondTestItem = testItems[secondId - 1]
            return ShoppingListService.getById(db, secondId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: secondId,
                        name: secondTestItem.name,
                        price: secondTestItem.price,
                        category: secondTestItem.category,
                        checked: secondTestItem.checked,
                        date_added: secondTestItem.date_added,
                    })
                })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 2
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    [
                        {
                            id: 1,
                            name: 'Avocado',
                            price: '5.00',
                            category: 'Main',
                            checked: false,
                            date_added: new Date('2029-01-22T16:28:32.615Z'),
                            
                        },
                        {
                            id: 3,
                            name: 'Apples',
                            price: '1.30',
                            category: 'Lunch',
                            checked: false,
                            date_added: new Date('2023-12-22T16:28:32.615Z'),
                            
                        },
                        {
                            id: 4,
                            name: 'Oranges',
                            price: '8.00',
                            category: 'Snack',
                            checked: false,
                            date_added: new Date('2019-01-17T16:28:32.615Z'),
                            
                        },
                    ]
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an article from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 2
            const newItemData = {
                name: 'updated name',
                price: '5.05',
                category: 'Main',
                checked: true || false,
                date_added: new Date(),
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData,
                    })
                })
        })
        
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new name',
                price: '2.35',
                category: 'Lunch',
                checked: true || false,
                date_added: new Date('2020-01-01T00:00:00.000Z'),
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        category: newItem.category,
                        checked: newItem.checked,
                        date_added: newItem.date_added,
                    })
                })
        })
    })
})