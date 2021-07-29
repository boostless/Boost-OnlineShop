var showing = false
var s_Home = true
var s_Adverts = false
var s_Item = false
var sItems = []
var mItems = []

$(function() {
    window.onload = (e) =>{

      window.addEventListener('message', function(event){
          switch(event.data.ui){
            case 'openui':
              $('#shop').fadeIn()
              break;
            case 'closeui':
              if(s_Item){
                $('#sellItemModal').toggle('show')
              }
              $('#shop').fadeOut()
              break;
          }       

          switch(event.data.shop){
            case 'setmitems':
              setUpSell(event.data.data)
              break;
            case 'refresh':
              sItems = JSON.parse(event.data.sItems)
              mItems = JSON.parse(event.data.mItems)
              $('#addAmount').text(sItems.length)
              $('#myAmount').text(mItems.length)
              refreshItems()
              break;
          }
      })

      $('#search').on('keyup', function(){
        $('#shoplist').empty()
        var val = $.trim(this.value);
        if(val){
          val = val.toLowerCase();
          $.each(sItems, function(_, obj){
            if(obj.name.toLowerCase().indexOf(val) != -1){
              $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${obj.name}'><p class='w-10 bg-gray-500 rounded-xl shadow' id='itemPrice'>${obj.price}$</p><img src='./img/${obj.name}.png' class='mx-auto seller' id='${obj.seller}'><p class='text-black my-1'><span>${obj.label}</span> <span id='itemQuantity'>x${obj.amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
            }
          })
        }else{
          for(var i = 0; i < sItems.length; i++){
            $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${sItems[i].name}'><p class='w-10 bg-gray-500 rounded-xl shadow' id='itemPrice'>${sItems[i].price}$</p><img src='./img/${sItems[i].name}.png' class='mx-auto seller' id='${sItems[i].seller}'><p class='text-black my-1'><span>${sItems[i].label}</span> <span id='itemQuantity'>x${sItems[i].amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
          }
        }
      })

       $('.b_SellItem').on('click', function(){
         if(!s_Item){
          $('#sellItemModal').toggle('show')
          s_Item = true
         }else{
          $('#sellItemModal').toggle('show')
          s_Item = false
         }   
       })

      $('.b_SellCancel').on('click', function(){
        if(s_Item){
          $('#sellItemModal').toggle('show')
          s_Item = false
         }  
      })

      $('.b_SellAnnounce').on('click', function(){
        if($('#SsellItems').children(':selected').attr('id') != 'choose'){
          let _item = $('#SsellItems').children(':selected').attr('id')
          let _amount = $('#i_Amount').val()
          let _price = $('#i_Price').val()
          $.post('http://Boost-OnlineShop/AddItemToShop', JSON.stringify({
            amount: _amount,
            price: _price,
            item: _item
          }), function(added){
            if(added){
              if(s_Item){
                $('#sellItemModal').toggle('show')
                s_Item = false
              }
            }
          });
        }
      })

       $('.b_Home').on('click', function(){
         $('#shoplist').empty()
         for(var i = 0; i < mItems.length; i++){
          $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${mItems[i].name}'><p class='w-10 bg-gray-500 rounded-xl shadow' id ='itemPrice'>${mItems[i].price}$</p><img src='./img/${mItems[i].name}.png' class='mx-auto'><p class='text-black my-1'>${mItems[i].label} x<span id='itemQuantity'>${mItems[i].amount}</span></p><button class='font-bold bg-red-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-red-500 b_Remove'><i class="fas fa-trash"></i> Remove</button>`).hide().fadeIn(100)
         }
       })

       $('.b_Adverts').on('click', function(){
         $('#shoplist').empty()
         for(var i = 0; i < sItems.length; i++){
            $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${sItems[i].name}'><p class='w-10 bg-gray-500 rounded-xl shadow' id='itemPrice'>${sItems[i].price}$</p><img src='./img/${sItems[i].name}.png' class='mx-auto seller' id='${sItems[i].seller}'><p class='text-black my-1'><span>${sItems[i].label}</span> <span id='itemQuantity'>x${sItems[i].amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
         }
      })

      $('#container').on('click', '.b_Remove',function(){
        let button = $(this)
        let _item = button.parent().get(0).id
        let _amount = button.parent().find('span#itemQuantity').text()
        let _price = button.parent().find('p#itemPrice').text()
        $.post('http://Boost-OnlineShop/RemoveItemFromShop', JSON.stringify({
          amount: _amount.replace('x', ''),
          price: _price.replace('$',''),
          item: _item
        }), function(removed){
          if(removed){
            button.parent().remove()
            $('#myAmount').text(parseInt($('#myAmount').text() - 1))
          }
        })
      })

      $('#container').on('click', '.b_Buy',function(){
        let button = $(this)

        let _item = button.parent().get(0).id
        let _amount = button.parent().find(`span:eq(1)`).text()
        let _price = button.parent().find(`p:eq(0)`).text()
        let _seller = button.parent().find('img.seller').attr('id')

        $.post('http://Boost-OnlineShop/BuyItemFromShop', JSON.stringify({
          amount: _amount.replace('x', ''),
          price: _price.replace('$',''),
          item: _item,
          seller: _seller
        }), function(bought){
          if(bought){
            button.parent().remove()
          }
        })
      })

      document.onkeyup = function(event){
        if(event.key == "Escape"){
          $.post('http://Boost-OnlineShop/CloseUi');
        }
      };
    }
});

// Cia setupinam itemus liste
function setUpSell(data){
  var pData = JSON.parse(data)
  $('#SsellItems').empty()
  $('#SsellItems').append(`<option id='choose'>Choose an item</option>`)
  for(var i=0; i < pData.length; i++){
    $('#SsellItems').append(`<option id='${pData[i].name}'>${pData[i].label} x${pData[i].amount}</option>`)
  }
}

function refreshItems(){
  var pData = sItems
  $('#shoplist').empty()
  for(var i=0; i < pData.length; i++){
     $('#shoplist').append(`<div class='bg-gray-50 rounded-xl p-1 text-center transition-all ease-in-out shadow-xl hover:shadow-2xl b_Item' id='${pData[i].name}'><p class='w-10 bg-gray-500 rounded-xl shadow' id='itemPrice'>${pData[i].price}$</p><img src='./img/${pData[i].name}.png' class='mx-auto seller' id='${pData[i].seller}'><p class='text-black my-1'><span>${pData[i].label}</span> <span id='itemQuantity'>x${pData[i].amount}</span></p><button class='font-bold bg-green-400 rounded-xl p-1 transition-all ease-in-out w-full hover:bg-green-500 b_Buy'><i class="fas fa-dollar-sign"></i> Buy</button></div>`).hide().fadeIn(100)
  }
}



