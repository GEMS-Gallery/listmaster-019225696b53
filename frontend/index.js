import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `shopping-item ${item.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <button class="complete-btn" data-id="${item.id}">
          <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
        </button>
        <span>${item.description}</span>
        <button class="delete-btn" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      `;
      shoppingList.appendChild(li);
    });
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = newItemInput.value.trim();
    if (description) {
      await backend.addItem(description);
      newItemInput.value = '';
      await renderShoppingList();
    }
  });

  // Delete item
  shoppingList.addEventListener('click', async (e) => {
    if (e.target.closest('.delete-btn')) {
      const id = Number(e.target.closest('.delete-btn').dataset.id);
      await backend.deleteItem(id);
      await renderShoppingList();
    }
  });

  // Toggle item completion
  shoppingList.addEventListener('click', async (e) => {
    if (e.target.closest('.complete-btn')) {
      const id = Number(e.target.closest('.complete-btn').dataset.id);
      await backend.toggleComplete(id);
      await renderShoppingList();
    }
  });

  // Initial render
  await renderShoppingList();
});
