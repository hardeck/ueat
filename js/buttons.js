Storage.prototype.setObj = function(key, obj) {

        return this.setItem(key, JSON.stringify(obj))
    };

    Storage.prototype.getObj = function(key) {
        return JSON.parse(this.getItem(key))
    };
$(document).ready(function() {
	if (sessionStorage.getItem("zaloguj") === "WYLOGUJ"){
		$('#zaloguj').text(sessionStorage.getItem("zaloguj"))
		$('#zaloguj').attr('href', 'dane-modal')
	}
	if (sessionStorage.getItem("basket_counter") === null)
		sessionStorage.setItem("basket_counter", 0)
	$(".basket").text(sessionStorage.getItem("basket_counter"))
	var number = 0
	var sum = 0
	var suma = 0
	var product= ""
	var products = {}
	var currency = ""
	$("button.add-button").click(function() {
		$(".price").text($(this).text())
		$(".product").text(($(this).parent().prev().text()))
		product=($(this).parent().prev().text())
		currency=$(this).text()
		number = Number(currency.replace(/[^0-9.-]+/g,""))
	})
	$(document).on("click", "#koszyk", function() {
		if (sessionStorage.getItem("sum-list") === null){
			$(".naleznosc").text("Twój koszyk jest pusty")
			$("#dokasy").hide()
		}
		else {
			$("#sum-list").html(sessionStorage.getItem("sum-list"))	
			$(".naleznosc").text("Należność ")
			$(".amount").text(sessionStorage.getItem("suma") + " zł")
		}
	})
	$(document).on("click", ".btn-danger", function(){
		var amount= parseInt($(this).parent().prev().find("select").val())
		var basket_counter=parseInt(sessionStorage.getItem("basket_counter"))+amount
		sessionStorage.setItem("basket_counter", basket_counter)
		$(".basket").text(sessionStorage.getItem("basket_counter"))
		if (sessionStorage.getItem("sum-list") === null) 
			var listaContent='<li class="list-group-item"><div class="row"><div class="col-6 sum-product">'+product+'</div><div class="col-3 sum-price">'+amount+'</div><div class="col-3 sum-amount">'+currency+'</div></div></li>'
		else
			var listaContent = sessionStorage.getItem("sum-list").concat('<li class="list-group-item"><div class="row"><div class="col-6 sum-product">'+product+'</div><div class="col-3 sum-price">'+amount+'</div><div class="col-3 sum-amount">'+currency+'</div></div></li>')
		sessionStorage.setItem("sum-list",listaContent)
		$("#sum-list").html(sessionStorage.getItem("sum-list"))
		$(".naleznosc").text("Należność ")
		if (sessionStorage.getItem("suma")=== null)
			suma=suma+sum
		else
			suma=parseInt(sessionStorage.getItem("suma"))+sum
		sessionStorage.setItem("suma", suma)
		$(".amount").text(sessionStorage.getItem("suma") + " zł")
		products[product]=amount
		sessionStorage.setObj("products", products)
		$("#dokasy").show()
	})
	$('select').on('change', function() {
		sum=parseInt($(this).val()) * number
		$(".sum").text(sum + " zł")
	})
	$('#dokasy').on('click', function() {
		$("#imie").val(sessionStorage.getItem("imie"))
		$("#nazwisko").val(sessionStorage.getItem("nazwisko"))
		$("#telefon").val(sessionStorage.getItem("telefon"))
		$("#mail").val(sessionStorage.getItem("email"))
		var products = JSON.parse(sessionStorage.products);
		for (var key in products) {
				$(".dane-zamowienia").append('<div class="row zamowienie"><div class="col-9">'+key+'</div><div class="col-3">'+products[key]+'</div></div>');
		}
		$(".dane-zamowienia").append('<div class="row zamowienie"><div class="col-9"><b>Do zapłaty</b></div><div class="col-3"><b>'+sessionStorage.getItem("suma")+'zł'+'</b></div></div>');
	})
/*	$(".pep_form").on("submit", function(e) {
			console.log("kliknales submit");
	        e.preventDefault();
			$.ajax({
            url: "https://secure.paylane.com/order/cart.html",
            type: 'POST',
            data: $('#pep_form').serialize(),
            success: function(data){
                 alert('successfully submitted')
            }
        });
	})
*/
	$("form[name='pep_form']").submit(function(e) {
	alert('siema');
});
	$('#pep').click(function(e){
      e.preventDefault();
      var merchant_id=$('#merchant_id');
      var amount=sessionStorage.getItem("suma");
      var currency=$('#currency');
      var description=$('#description');
	var transaction_description=sessionStorage.getItem("imie")+sessionStorage.getItem("nazwisko")+description.val();
	var back_url=$('#back_url');
	var hash=$('#hash');
	var dane='?amount='+amount+'&currency='+currency.val()+'&merchant_id='+merchant_id.val()+'&description='+description.val()+'&transaction_description='+transaction_description+'&transaction_type=S&back_url='+back_url.val()+'&language=pl&hash='+hash.val();
      url="https://secure.paylane.com/order/cart.html";
      console.log(dane)
      window.location.href = url+dane
        });
  
    /*
      $.post('http://path/to/post', 
         $('#myForm').serialize(), 
         function(data, status, xhr){
           // do something here with response;
         });
      */
	firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential && sessionStorage.getItem("token")===null ) {
         var token = result.credential.accessToken; 
	 sessionStorage.setItem("token", token);
	}
	if(sessionStorage.getItem("token")!=null) {
         var user = result.user;
	 var imieinazwisko=user.displayName.split(" ");
	 sessionStorage.setItem("imie", imieinazwisko[0]);
	 sessionStorage.setItem("nazwisko", imieinazwisko[1]); }
	 sessionStorage.setItem("email", user.email);
	 sessionStorage.setItem("zaloguj", "WYLOGUJ");
	 $('#login-modal').modal('hide');
	 $('#zaloguj').text(sessionStorage.getItem("zaloguj"));
	 $('#zaloguj').attr('href', 'dane-modal');
         }).catch(function(error) {
                       var errorCode = error.code;
                       var errorMessage = error.message;
                       var credential = error.credential;
                       });
 $("#sidebar-wrapper a").click(function(e) {
    $("#wrapper").removeClass("toggled");
  });
});
