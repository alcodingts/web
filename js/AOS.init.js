// aos js init
AOS.init({
    once: true
});

// button trial placement when mobile
// function trialButtonPlacement() {
//     const navbarCollapseMobile = document.querySelector('.collapse.navbar-collapse');
//     const trialButtonNavbar = document.querySelector('#trialButtonNavbar');
//     const trialButtonMobileWrapper = document.querySelector('#trialButtonMobileWrapper');

//     if (window.innerWidth < 992) {
//         trialButtonMobileWrapper.append(trialButtonNavbar);
//     } else {
//         navbarCollapseMobile.append(trialButtonNavbar);
//     }
// }
function trialButtonPlacement() {
    const navbarCollapseMobile = document.querySelector('.collapse.navbar-collapse');
    const trialButtonNavbar = document.querySelector('#trialButtonNavbar');
    const trialButtonMobileWrapper = document.querySelector('#trialButtonMobileWrapper');

    // Only run if the button actually exists
    if (!trialButtonNavbar) return;

    if (window.innerWidth < 992) {
        if (trialButtonMobileWrapper) {
            trialButtonMobileWrapper.append(trialButtonNavbar);
        }
    } else {
        if (navbarCollapseMobile) {
            navbarCollapseMobile.append(trialButtonNavbar);
        }
    }
}


// button sicky bottom when mobile
function buttonStickyMobile() {
    if (window.innerWidth < 768) {
        let scroll = $(window).scrollTop();
    
        if (scroll >= 400) {
            $(".buttonStickyMobile").addClass("show");
        } else {
            $(".buttonStickyMobile").removeClass("show");
        }
    }
}

// add navbar padding top when mobile
function addNavbarMobilePadding() {
    const navbarHeight = document.querySelector(".navbar").offsetHeight;
    const bsnavbar = document.querySelector(".bsnav-mobile .navbar");
    bsnavbar.style.paddingTop = navbarHeight + "px";
}

// add first section padding top
function addFirstSectionPadding() {
    const navbarHeight = document.querySelector(".navbar").offsetHeight + 30;
    const navbarHeightSecondary = document.querySelector(".navbar").offsetHeight + 25;
    const firstSection = document.querySelector(".navbar-space");
    const firstSectionSecondary = document.querySelector(".navbar-space-secondary");

    if(firstSection) {
        firstSection.style.paddingTop = navbarHeight + "px";
    } else if(firstSectionSecondary) {
        firstSectionSecondary.style.paddingTop = navbarHeightSecondary + "px";
    }
}

// init match height for portfolio project card
$('.portfolio__info').matchHeight();
$('.portfolio-other__info').matchHeight();
$('.footer__subtitle').matchHeight();

document.addEventListener("DOMContentLoaded", function(event) { 
    trialButtonPlacement();
    addNavbarMobilePadding();
    addFirstSectionPadding();

    $('.float-button').fadeIn(300);

    // float button
    const floatButton = document.querySelector(".float-button__image");
    const floatButtonList = document.querySelector(".float-button__list");
    floatButton.addEventListener("click", () => {
        floatButtonList.classList.toggle('show');
    });
});

window.addEventListener('load', function(event) {
    // remove loading page
    // $(".loading-page").fadeOut(200, function() {
    //     $(this).remove();
    // });
});

window.addEventListener('resize', function(event) {
    trialButtonPlacement();
    addNavbarMobilePadding();
    addFirstSectionPadding();
});

$(window).scroll(function() {
    buttonStickyMobile();
});

// get user location based on IP -- start
const waButton = document.querySelector('#WA-floating-button');
const fetchController = new AbortController();
let getCustomerCountry = null;
let countryName;
// Make the request
const fetchTimeout = setTimeout( () => fetchController.abort(), 5000 )

// let APITarget = 'https://ipwho.is/';
let APITarget = 'https://ipapi.co/json/';

waButton.addEventListener('click', (event) => {
    event.preventDefault();
    let url = waButton.href;
    window.open(url, '_blank').focus();
    gtag_report_wa_conversion(url)
})

fetch(APITarget)
// Extract JSON body content from HTTP response
.then(response => {
    if (response.ok) {
        return response.json()
    }
})
// Do something with the JSON data
.then(data => {
    getCustomerCountry = true;
    countryName = data.country_name.replace(/ /g, '_');
    // console.log(countryName)
    if ( window[countryName+'_link'] ) {
        waButton.href = window[countryName+'_link'];
    } else {
        waButton.href = window['defaultLink'];
    }
    // if ( data.success ) {
    // } else {
    //     console.log('success, but something is wrong')
    //     console.log(data)
    // }
})
// do something if theres error
.catch(error => {
    // console.log('something went wrong')
    // console.log(error)
    getCustomerCountry = false;
    countryName = 'Indonesia'
    waButton.href = window['defaultLink'];
});
fetchController;
// get user location based on IP -- end

// https://api.whatsapp.com/send?phone=6283114272998

// Get all elements with a specific class

const dropDownTriggerLinks=document.querySelectorAll('.dropdown');
const dropDownItems = document.querySelectorAll('.dropdown .navbar-nav .nav-item');
dropDownTriggerLinks.forEach((element) => {
    element.addEventListener('mouseenter', function(event){
        let dropdownItemFirstChild = event.target.children[1].firstElementChild;
        // dropdownItemFirstChild.classList.add('active');
        el_overlay = document.createElement('span');
        el_overlay.className = 'screen-darken';
        document.body.appendChild(el_overlay)
    });

    element.addEventListener('mouseleave', function(event){
        document.body.removeChild(document.querySelector('.screen-darken'));
    });
});

// dropDownItems.forEach((element) => {
//     element.addEventListener('mouseenter', function(event){
//         let hoveredElement = event.target;
//         hoveredElement.classList.add('active');
//     });
//     element.addEventListener('mouseleave', function(event){
//         let hoveredElement = event.target;
//         hoveredElement.classList.remove('active');
//     });
// });
