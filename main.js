'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))
//CRUD

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

//Interaction
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if(isValidFields()){
        const client = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            cellphone: document.getElementById('cellphone').value,
            city: document.getElementById('city').value
        }
        const index = document.getElementById('name').dataset.index
        if(index == 'new'){
            createClient(client)
            updateTable()
            closeModal()
        }else{
            updateClient(index, client)
            updateTable()
            closeModal()
        }
        
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.cellphone}</td>
        <td>${client.city}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tbClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll("#tbClient>tbody tr")
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('name').value = client.name
    document.getElementById('email').value = client.email
    document.getElementById('cellphone').value = client.cellphone
    document.getElementById('city').value = client.city
    document.getElementById('name').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        if(action == 'edit'){
            editClient(index)
        }else{
            const client = readClient()[index]
            const response = confirm(`Deseja realmete excluir o cliente ${client.name}`)
            if(response){
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('save')
    .addEventListener('click', saveClient)

document.querySelector('#tbClient>tbody')
    .addEventListener('click', editDelete)