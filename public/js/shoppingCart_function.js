$("#order").on("click",orderProduct);
$("#empty").on("click",clearCart);

data={};
async function orderProduct(){
  alert ("Thank you for ordering");
  await updateStock();
  await clearCart();
}

async function clearCart(){
  await fetch('/shoppingCart', {
    method:'DELETE'
  });
  location.reload();
}

async function updateStock() {
  const updates = [...$('.quantity')].map(q => ({
    product_id: parseInt($(q).attr('id')),
    quantity: parseInt($(q).html())
  }));

  await Promise.all(updates.map(update => fetch('/shoppingCart', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(update)
  })));
}





