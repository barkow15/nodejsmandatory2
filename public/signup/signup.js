$(document).ready(function (){
    let signupFormElem = $(`#signupForm`);

    signupFormElem.on(`submit`, (e) =>{
         // prevent normal form behavior
        e.preventDefault();

        // serialize form fields
        const data = signupFormElem.serialize(); 

        $.ajax({
            type: "POST",
            url: "/signup",
            data: data,
            dataType: "json",
            success: (res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Good to have you onboard!',
                    html: 'We have succesfully created a user for you. You will be redirected in <span class="redirectcountdown">1</span> seconds'
                });
                //var obj = jQuery.parseJSON(data); if the dataType is not specified as json uncomment this
                // do what ever you want with the server response
                let redirectCountdownElem = $('.redirectcountdown');
                var counter = 1;
                var interval = setInterval(function() { // Set timer
                    counter++;
                    redirectCountdownElem.text(counter);
                    if (counter == 5) {
                        clearInterval(interval);
                        redirectCountdownElem.parent().html('redirecting...');
                        window.location.replace(res.response.redirectURL);
                    }
                }, 1000);
            },
            error: (e) => {
                const errorMessage = e.responseJSON.response;
                //console.log(errorMessage);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorMessage
                });
                //alert('error handling here');
            }
        });
    });
});