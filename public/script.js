window.onload = async (event) => {
  await renderInventory();
  document.getElementById('create_button').addEventListener('click', newItem);
};

async function renderInventory() {
  const $inventory = document.getElementById('inventory');
  const inventory = await fetchInventory();

  inventory.forEach(item => {
    $inventory.appendChild(renderItem(item));
  });
}

function renderItem(item) {
  const $container = document.createElement('div');
  $container.classList.add('item');
  $container.setAttribute('id', `item_${item._id}`);

  const $name = document.createElement('input');
  $name.classList.add('item_name');
  $name.setAttribute('default', item.name);
  $name.value = item.name;
  $name.disabled = true;

  const $price = document.createElement('input');
  $price.classList.add('item_price');
  $price.setAttribute('default', item.price);
  $price.value = item.price;
  $price.disabled = true;

  const $edit = document.createElement('button');
  $edit.classList.add('item_edit');
  $edit.setAttribute('edit', false);
  $edit.innerText = 'Edit';
  $edit.addEventListener('click', (e) => onEditClick(e, $container));

  const $save = document.createElement('button');
  $save.classList.add('item_save');
  $save.innerText = 'Save';
  $save.hidden = true;
  $save.addEventListener('click', (e) => onSaveClick(e, $container, item._id));

  $container.appendChild($name);
  $container.appendChild($price);
  $container.appendChild($edit);
  $container.appendChild($save);
  
  return $container;
}

function onEditClick(e, $container) {
  const currentState = e.target.getAttribute('edit') == 'true';
  toggleItemEdit($container, !currentState);
}

function onSaveClick(e, $container, id) {
  const $name = $container.getElementsByClassName('item_name')[0];
  $name.setAttribute('default', $name.value);
  const $price = $container.getElementsByClassName('item_price')[0];
  $price.setAttribute('default', $price.value);
  saveItem(id, $name.value, $price.value)

  const currentState = e.target.getAttribute('edit') == 'true';
  toggleItemEdit($container, currentState);
}

function toggleItemEdit($container, edit) {
  const $name = $container.getElementsByClassName('item_name')[0];
  $name.value = $name.getAttribute('default');
  $name.disabled = !edit;

  const $price = $container.getElementsByClassName('item_price')[0];
  $price.value = $price.getAttribute('default');
  $price.disabled = !edit;

  const $edit = $container.getElementsByClassName('item_edit')[0];
  $edit.setAttribute('edit', edit);

  const $save = $container.getElementsByClassName('item_save')[0];
  $save.hidden = !edit;

  if (edit) {
    $edit.innerText = 'Cancel';
  } else {
    $edit.innerText = 'Edit';
  }
}

async function newItem() {
  const name = document.getElementById('create_name').value;
  const price = document.getElementById('create_price').value;
  const newItem = await createItem(name, price)
  
  if (newItem.status == 422) {
    alert(newItem.error);
    return;
  }
  
  document.getElementById('inventory').appendChild(renderItem(newItem));
}

async function createItem(name, price) {
  const data = { name, price: parseInt(price) };
  return (await fetch('/items/api/v1', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })).json();
}

async function saveItem(id, name, price) {
  const data = { id, name, price: parseInt(price) };
  await fetch('/items/api/v1', { 
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function fetchInventory() {
  const response = await fetch('/items/api/v1/all');
  return await response.json();
}