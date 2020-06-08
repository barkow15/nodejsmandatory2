$(document).ready(function (){
    const sendMailFormElem = $(`#sendMailForm`);
    

    sendMailFormElem.on(`submit`, (e) => {
         // prevent normal form behavior
        e.preventDefault();

        // serialize form fields
        const data = sendMailFormElem.serialize(); 

        // disable button
        $('.sendemail-button').prop("disabled", true);

        $.ajax({
            type: "POST",
            url: "/email/send",
            data: data,
            dataType: "json",
            complete: () => {
                $('.sendemail-button').prop("disabled", false);
            },
            success: (res) => {
                Swal.fire({
                    icon: 'info',
                    title: 'The email was sent. Thanks for connecting!',
                    text: '(You can only send a message via this form every 15 minutes)'
                });
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