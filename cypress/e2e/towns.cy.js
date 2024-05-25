/// <reference types="cypress" />
const towns = ['Bourgas', 'Sofia', 'Plovdiv', 'Varna'];
describe('Town Project E2E', () => {
    beforeEach('Open page', () => {
        cy.visit('towns.html')
    })

    it('Verify url', () => {
        cy.url().should('include', 'towns')
    })

    it("Verify listed towns - ('Bourgas', 'Sofia', 'Plovdiv', 'Varna')", () => {
        for (const town of towns) {
            cy.get('#towns').should('be.visible').within(() => {
                cy.get('option').contains(town).should('be.visible');
            })
        }
    })

    it('Verify delete functionality', () => {
        cy.contains('button', 'Delete').should('be.visible').as('deleteBtn');
        for (const town of towns) {
            cy.get('#townName').should('be.visible').as('selectElement')
            .clear()
            .type(town)
            cy.get('@deleteBtn').click();
            
            cy.get('#towns').within(() => {
                cy.contains('option', town).should('not.exist');
            });

            cy.get('#result').should('contain.text', `${town} deleted.`)
        }
    })
    
    it('Verify Add town functionality', () => {
        const randomTowns = ['Kazanlak', 'Vidin', 'Tarnovo'];
        cy.contains('article', 'Add Existing Town').should('be.visible')
        .within(() => {
            cy.get('input#townNameForAdd').should('be.visible')
            cy.contains('button', 'Add').should('be.visible')
        })

        for (const town of randomTowns) {
            cy.get('#townNameForAdd')
            .clear()
            .type(town)
            cy.get('#btnAdd').click();
            cy.get('#towns').within(() => {
                cy.contains('option', town).scrollIntoView().should('be.visible')
            })
            cy.get('#result').should('contain.text', `${town} added.`)
        }
    })

    it('Verify Shuffle functionality test', () => {
        cy.get('select#towns').then((select) => {
            const beforeShuffleOptions = [];
            select.find('option').each((index, option) => {
                beforeShuffleOptions.push(option.value);
            });

            cy.get('button#btnShuffle').click();

            cy.get('select#towns').then((select) => {
                const afterShuffleOptions = [];
                select.find('option').each((index, option) => {
                    afterShuffleOptions.push(option.value);
                });

                cy.wrap(beforeShuffleOptions).should('not.deep.equal', afterShuffleOptions);
            });
        });

        cy.get('#result').should('contain.text', 'Towns shuffled.')
    })
})