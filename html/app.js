var showing = false
var s_Home = true
var s_Adverts = false

$(function() {
    window.onload = (e) =>{
      var sItems =[{
        item: 'bread',
        price: 10,
        amount: 2,
      },
      {
        item: 'cigarette',
        price: 20,
        amount: 30,
      },
      {
        item: 'phone',
        price: 5,
        amount: 51,
      },
      {
        item: 'beer',
        price: 500,
        amount: 22,
      },
      {
        item: 'bread',
        price: 10,
        amount: 2,
      },
      {
        item: 'cigarette',
        price: 20,
        amount: 30,
      },
      {
        item: 'phone',
        price: 5,
        amount: 51,
      },
      {
        item: 'beer',
        price: 500,
        amount: 22,
      },
      {
        item: 'bread',
        price: 10,
        amount: 2,
      },
      {
        item: 'cigarette',
        price: 20,
        amount: 30,
      },
      {
        item: 'phone',
        price: 5,
        amount: 51,
      },
      {
        item: 'beer',
        price: 500,
        amount: 22,
      },
      {
        item: 'bread',
        price: 10,
        amount: 2,
      },
      {
        item: 'cigarette',
        price: 20,
        amount: 30,
      },
      {
        item: 'phone',
        price: 5,
        amount: 51,
      },
      {
        item: 'beer',
        price: 500,
        amount: 22,
      },
      {
        item: 'bread',
        price: 10,
        amount: 2,
      },
      {
        item: 'cigarette',
        price: 20,
        amount: 30,
      },
      {
        item: 'phone',
        price: 5,
        amount: 51,
      },
      {
        item: 'beer',
        price: 500,
        amount: 22,
      },
    ]

    var mItems = [{
      item: 'black_usb',
      price: 10,
      amount: 20
    },
    {
      item: 'beer',
      price: 500,
      amount: 22,
    },
  ]

      for(var i = 0; i < sItems.length; i++){
        console.log(sItems[i].item)
        $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${sItems[i].item}'><p class='w-10 bg-gray-500 rounded-xl shadow'>${sItems[i].price}$</p><img src='./img/${sItems[i].item}.png' class='mx-auto'><p class='text-black my-1'><span id='itemPrice'>${sItems[i].item}</span> <span id='itemQuantity'>x${sItems[i].amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
      }

      $('#addAmount').text(sItems.length)
      $('#myAmount').text(mItems.length)

      $('#search').on('keyup', function(){
        $('#shoplist').empty()
        var val = $.trim(this.value);
        if(val){
          val = val.toLowerCase();
          $.each(sItems, function(_, obj){
            if(obj.item.toLowerCase().indexOf(val) != -1){
              $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${obj.item}'><p class='w-10 bg-gray-500 rounded-xl shadow'>${obj.price}$</p><img src='./img/${obj.item}.png' class='mx-auto'><p class='text-black my-1'>${obj.item} x${obj.amount}</p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500'><i class="fas fa-dollar-sign b_Buy"></i> Buy</button></div>`).hide().fadeIn(100)
            }
          })
        }else{
          for(var i = 0; i < sItems.length; i++){
            console.log(sItems[i].item)
            $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${sItems[i].item}'><p class='w-10 bg-gray-500 rounded-xl shadow'>${sItems[i].price}$</p><img src='./img/${sItems[i].item}.png' class='mx-auto'><p class='text-black my-1'><span id='itemPrice'>${sItems[i].item}</span> <span id='itemQuantity'>x${sItems[i].amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
          }
        }
      })

      $('.b_SellItem').on('click', function(){
        $('#sellItemModal').toggle('show')
      })

      $('.b_SellCancel').on('click', function(){
        $('#sellItemModal').toggle('show')
      })

      $('.b_Home').on('click', function(){
        $('#shoplist').empty()
        for(var i = 0; i < mItems.length; i++){
          $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${mItems[i].item}'><p class='w-10 bg-gray-500 rounded-xl shadow'>${mItems[i].price}$</p><img src='./img/${mItems[i].item}.png' class='mx-auto'><p class='text-black my-1'>${mItems[i].item} x${mItems[i].amount}</p><button class='font-bold bg-red-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-red-500 b_Remove'><i class="fas fa-trash"></i> Remove</button>`).hide().fadeIn(100)
        }
      })

      $('.b_Adverts').on('click', function(){
        $('#shoplist').empty()
        for(var i = 0; i < sItems.length; i++){
          $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${sItems[i].item}'><p class='w-10 bg-gray-500 rounded-xl shadow'>${sItems[i].price}$</p><img src='./img/${sItems[i].item}.png' class='mx-auto'><p class='text-black my-1'><span id='itemPrice'>${sItems[i].item}</span> <span id='itemQuantity'>x${sItems[i].amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
        }
      })

      $('#container').on('click', '.b_Remove',function(){
        let button = $(this)
        button.parent().remove()
      })

      $('#container').on('click', '.b_Buy',function(){
        let button = $(this)
        console.log(button.parent().get(0).id)
      })

    }
});




