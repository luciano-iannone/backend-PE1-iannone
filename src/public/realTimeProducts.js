const socket = io();

socket.on('products', handleProducts);

function handleProducts(data) {
    console.log('Received products:', data);
    const productsList = document.getElementById('products');
    productsList.innerHTML = "";

    data.forEach(product => {
        const listItem = createProductListItem(product);
        productsList.appendChild(listItem);
    });
}

function createProductListItem(product) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <strong>Title:</strong> ${product.title}<br>
    <strong>Price:</strong> $${product.price}<br>
    <strong>Stock:</strong> ${product.stock}<br>
    <button onclick="removeProduct('${product._id}')">Remove</button>
    <hr>
    `;
    return listItem;
}

function removeProduct(id) {
    fetch(`/api/products/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
}

function addProduct() {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        status: document.getElementById("status").checked,
        category: document.getElementById("category").value,
    };

    fetch('api/products', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    })
        .then(response => response.json())
        .then(data => handleAddProductResponse(data))
        .catch(error => console.error("Error:", error));
}

function handleAddProductResponse(data) {
    console.log("Success:", data);
    if (data.status === "error") {
        alert(data.message);
    }
}
