// Function to handle a timeout as a promise
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function (){
    let loginFormElem = $(`#loginForm`);

    loginFormElem.on(`submit`, (e) =>{
         // prevent normal form behavior
        e.preventDefault();

        // serialize form fields
        const data = loginFormElem.serialize(); 

        $.ajax({
            type: "POST",
            url: "/login",
            data: data,
            dataType: "json",
            success: (res) => {
                console.log(res.redirectURL);
                Swal.fire({
                    icon: 'success',
                    title: 'Good to see you again!',
                    html: 'You will be redirected in <span class="redirectcountdown">1</span> seconds'
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
                        window.location.replace(`${res.redirectURL}`);
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