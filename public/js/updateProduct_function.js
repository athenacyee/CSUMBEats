let productID = 0;
$('#editBtn').click(async () => {
  const selectedId = $('#productSelect').val();
  const data = await fetch('/api/productInfo?product_id=' + selectedId)
                      .then(res => res.json());
  console.log(data);
  displayProductDetails(data);
});

//$('#editBtn').on("click", displayProductDetails);
$('#edit_btn').click(updateProductInfo);


async function displayProductDetails(data){
 var myModal = new bootstrap.Modal(document.getElementById('EditProduct'));
 myModal.show();
//  product_id = $(this).attr("id");
//  let url = `/api/productInfo?product_id=${product_id}`;
//  let response = await fetch(url);
//  data = await response.json();
//  console.log(data);
 $('#name').val(data[0].name);
 $('#price').val(data[0].price);
 $('#description').val(data[0].description);
 $('#stock').val(data[0].stock);
 $('#image').val(data[0].image);
 productID = data[0].product_id;
}

async function updateProductInfo() {
  const result = {};

  result.name = $('#name').val();
  result.price = $('#price').val();
  result.description = $('#description').val();
  result.stock = $('#stock').val();
  result.image =$('#image').val();
  
  //let url = `/api/productInfo?product_id=${product_id}`;
  let url = `/api/productInfo?product_id=${productID}`;
  let response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result) // We send data in JSON format
  });
  location.reload();
}