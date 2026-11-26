/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {

     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
               token = tkn
          })
     });

     // Objetivo: Verificar que a API retorna lista de livros com paginação e filtros funcionando
     // Validar que filtros por categoria e autores funcionam corretamente
     it('GET - Deve listar livros com filtros e paginação', () => {
          cy.api({
               method: 'GET',
               url: 'books',
               headers: { 'Authorization': token },
               qs: {
                    page: 0,
                    limit: 20,
                    search: 'machado',
                    category: 'category',
                    author: 'Machado de Assis'
               }
          }).should(response => {
               expect(response.status).to.equal(200)
          })
     });

     // Objetivo: Validar que é possível obter detalhes de um livro específico pelo ID
     // Verificar que todos os campos do livro são retornados corretamente
     it('GET - Deve obter detalhes de um livro específico', () => {
          cy.api({
               method: 'GET',
               url: 'books/6',
               headers: { 'Authorization': token }
          }).should(response => {
               expect(response.status).to.equal(200)
               expect(response.body.book).to.have.property('title', 'A Arte da Guerra')
               expect(response.body.book).to.have.property('author', 'Sun Tzu')
               expect(response.body.book).to.have.property('category', 'Estratégia')
          })
     });

     // Objetivo: Validar que um novo livro é adicionado com sucesso ao catálogo
     // Verificar que apenas admin pode adicionar novos livros (validação de permissão)
     it('POST - Deve cadastrar um novo livro com sucesso', () => {
           cy.api({
              method: 'POST',
              url: 'books',
              headers: { 'Authorization': token },
              body: {
                "title": "Lucinda atualizado1",
                "author": "Lucy Maud Montgomery",
                "description": "Classico da literatura infantojuvenil"
            }
        }).should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Livro criado com sucesso.')
        })
     });

     // Objetivo: Garantir que dados inválidos são rejeitados ao adicionar um livro
     // Validar mensagens de erro apropriadas para dados faltantes ou incorretos
     it('POST -  Deve rejeitar livro com dados inválidos', () => {
          cy.api({
            method: 'POST',
            url: 'books',
            headers: { 'Authorization': token },
            body: {
                "titl": "Anne com E",
                "author": "Lucy Maud Montgomery",
                "description": "Romance Classico da literatura infantojuvenil"
            },
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('\"title\" is required')
        })
     });

     // Objetivo: Validar que um livro pode ser atualizado com sucesso
     // Verificar que apenas admin pode atualizar livros (validação de permissão)
     it('PUT - Deve atualizar um livro previamente cadastrado', () => {
          cy.api({
            method: 'PUT',
            url: 'books/14',
            headers: { 'Authorization': token },
            body: {
                title: "os pequeninos Atualizado8",
                author: "Marry norton Atualizado",
                description: "Animação/anime atualizado",
                category: "Desenho"
            }
        }).should(response => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal("Livro atualizado com sucesso.")
        })
     });

     // Objetivo: Validar que um livro pode ser removido do catálogo
     // Verificar que apenas admin pode deletar livros (validação de permissão)
     it('DELETE - Deve deletar um livro previamente cadastrado', () => {
          cy.api({
            method: 'DELETE',
            url: 'books/9',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal("Livro deletado com sucesso.")
        })
     });
});
