///<reference types="cypress"/>
const bun = '[data-ingredient="bun"]';
const main = '[data-ingredient="main"]';
const sauce = '[data-ingredient="sauce"]';

const bun1 = {
  _id: '643d69a5c3f7b9001cfa093d',
  text: 'Флюоресцентная булка R2-D3'
};

const filling1 = {
  _id: '643d69a5c3f7b9001cfa0945',
  text: 'Соус с шипами Антарианского плоскоходца'
};

describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    // Перехват запроса на получение ингредиентов
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Загрузка страницы конструктора бургера
    cy.visit('localhost:4000/');
  });

  it('Тестирование существования компонента', () => {
    // Проверка существования различных типов ингредиентов
    cy.get(bun).should('exist');
    cy.get(main).should('exist');
    cy.get(sauce).should('exist');
  });

  it('тест добавления ингредиента', () => {
    cy.wait('@getIngredients');

    //   // Добавление ингредиента в конструктор
    cy.get(bun).contains('Добавить').click();
    cy.get(main).contains('Добавить').click();
    cy.get(sauce).contains('Добавить').click();
  });

  it('Тест открытия модального окна', () => {
    // Ждать загрузки ингредиентов
    cy.wait('@getIngredients');

    // Клик по ингредиенту bun для открытия модального окна
    cy.get(bun).first().click();

    // Проверка, что модальное окно открылось
    cy.get("[data-cy='modal']").should('be.visible');

    // Закрытие модального окна по нажатию на крестик
    cy.get("[data-cy='close_icon']").click();

    // Проверка, что модальное окно закрылось
    cy.get("[data-cy='modal']").should('not.exist');

    // Повторный клик по ингредиенту bun для открытия модального окна
    cy.get(bun).eq(1).click();

    // Проверка, что модальное окно открылось еще раз
    cy.get("[data-cy='modal']").should('be.visible');

    // Закрытие модального окна по нажатию на оверлей
    cy.get("[data-cy='modal-overlay']").click({ force: true });

    // Проверка, что модальное окно закрылось
    cy.get("[data-cy='modal']").should('not.exist');
  });

  describe('тест заказа', () => {
    beforeEach(() => {
      // Найдем кнопку "Оформить заказ" и сохраним как алиас
      cy.get('[data-cy="constructor"]')
        .contains('Оформить заказ')
        .as('orderButton');
    });

    it('тест заказа без булки и без авторизации', () => {
      // Кликаем по кнопке заказа без булки и без авторизации
      cy.get('@orderButton').click();
      // Проверяем, что модальное окно не открылось
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('тест заказа без булки и с авторизацией', () => {
      // Добавляем булку и ингредиент, затем кликаем на кнопку "Оформить заказ"
      cy.get(bun).contains('Добавить').click();
      cy.get(main).contains('Добавить').click();
      cy.get('@orderButton').click();

      // Проверяем, что перенаправило на страницу логина и модальное окно не открылось
      cy.url().should('include', '/login');
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    describe('тест успешного создания заказа', () => {
      beforeEach(() => {
        // Устанавливаем необходимые куки и токены для входа
        cy.setCookie('accessToken', 'accessToken');
        window.localStorage.setItem('refreshToken', 'refreshToken');

        // Мокаем запросы для авторизации и создания заказа
        cy.intercept('GET', '/api/auth/user', { fixture: 'userData.json' });
        cy.intercept('POST', '/api/auth/login', { fixture: 'userData.json' });
        cy.intercept('POST', '/api/orders', {
          fixture: 'ingredients.json'
        });

        cy.visit('/');
      });

      it('должен открыться модал с номером заказа', () => {
        // Добавляем булку и ингредиент, затем кликаем на кнопку "Оформить заказ"
        cy.get(bun).contains('Добавить').click();
        cy.get(main).contains('Добавить').click();
        cy.get('@orderButton').click();

        // Проверяем, что не перенаправило на логин
        cy.url().should('not.include', '/login');

        // Проверяем, что заказ исчез из конструктора
        cy.get('[data-cy="constructor"]')
          .contains(bun1.text)
          .should('not.exist');
        cy.get('[data-cy="constructor"]')
          .contains(filling1.text)
          .should('not.exist');

        // Проверяем, что текст "Выберите булки" появился
        cy.get('[data-cy="constructor"]').contains('Выберите булки');
      });
    });
  });
});
