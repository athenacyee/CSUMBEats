$("a").on("click", displayProductDetails);
$("#submit").on("click", checkStock);

data = {};
let myModal;
async function displayProductDetails() {
  myModal = new bootstrap.Modal(document.getElementById('productdetails'));
  myModal.show();
  //alert("hello");
  let product_id = $(this).attr("id");
  let url = `/api/productInfo?product_id=${product_id}`;
  let response = await fetch(url);
  data = await response.json();
  $("#productInfo").html(data[0].name);
  $("#productInfo").append(` <br> <img src="${data[0].image}" width="250"> <br>`);
  $("#productInfo").append(`<br> $ ${data[0].price} <br>`);
  $("#productInfo").append(`Description: ${data[0].description} <br>`);
}

async function checkStock() {
  let q = $("#input_quantity").val();
  if (q > data[0].stock) {
    alert("Not enough stock");
  } else if (q > 0) {
    await addCart(q);
    await updateStock(q);
  }
}

async function addCart(quantity) {
  await fetch('/api/productInfo', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: data[0].product_id,
      quantity: quantity
    })
  });
  myModal.hide();
}


// async function updateStock(quantity) {
//   await fetch('/api/productInfo', {
//     method: 'PUT',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       product_id: data[0].product_id,
//       quanity: quantity
//     })
//   });
// }
