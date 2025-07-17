// swiper js init

// banner swiper
// var bannerSwiper = new Swiper(".banner__swiper", {
//     slidesPerView: 1,
//     spaceBetween: 0,
//     effect: "coverflow",
//     coverflowEffect: {
//         rotate: 50,
//         stretch: 0,
//         depth: 100,
//         modifier: 1,
//         slideShadows: true,
//     },
//     loop: true,
//     navigation: {
//         nextEl: ".banner__next-button",
//         prevEl: ".banner__prev-button",
//     },
//     pagination: {
//         el: ".banner__pagination",
//         clickable: true,
//     },
//     breakpoints: {
//         576: {
//             spaceBetween: 35,
//         },
//         1399: {
//             spaceBetween: 40,
//         },
//         1439: {
//             spaceBetween: 50,
//         },
//     },
// });

var bannerSwiper = new Swiper(".banner-2__swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    // initialSlide: 1,
    loop: true,
    navigation: {
        nextEl: ".banner-2__next-button",
        prevEl: ".banner-2__prev-button",
    },
    pagination: {
        el: ".banner-2__pagination",
        clickable: true,
    },
    breakpoints: {
        576: {
            slidesPerView: 1,
            spaceBetween: 35,
        },

        768:{
            slidesPerView: 1.3,
            spaceBetween: 32,
        },
        1399: {
            slidesPerView: 1.3,
            spaceBetween: 40,
        },
        1439: {
            slidesPerView: 1.3,
            spaceBetween: 50,
        },
    },
});

// worldwide swiper
// marquee logo partner
let loops = gsap.utils.toArray('.worldwide__row').map((line, i) => {
    const links = line.querySelectorAll(".worldwide__list-holder"),
    tl = horizontalLogoLoop(links, {
        repeat: -1, 
        speed: 0.5 + i * 0.2,
        draggable: true,
        reversed: false,
        paddingRight: parseFloat(gsap.getProperty(links[0], "marginRight", "px"))
    });

    const isMobile = window.innerWidth <= 991;
    if (isMobile) {
        links.forEach((link, i) => {
            const more = link.querySelector('.worldwide__btn--more');
            const less = link.querySelector('.worldwide__btn--less');
            more.addEventListener("click", () => tl.pause());
            less.addEventListener("click", () => tl.resume());
        });
    } else {
        // Pause on hover for desktop devices
        line.addEventListener("mouseenter", () => tl.pause());
        line.addEventListener("mouseleave", () => tl.resume());
    }
    
    return tl;
}); 

function horizontalLogoLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
        populateWidths = () => items.forEach((el, i) => {
            widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
        }),
        getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;

    populateWidths();
    gsap.set(items, { xPercent: i => xPercents[i] });
    gsap.set(items, { x: 0 });
    totalWidth = getTotalWidth();

    for (i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

        tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
            .fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);

        times[i] = distanceToStart / pixelsPerSecond;
    }

    function toIndex(index, vars) {
        vars = vars || {};
        (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); 
        let newIndex = gsap.utils.wrap(0, length, index),
            time = times[newIndex];
        if (time > tl.time() !== index > curIndex) { 
            vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
            time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
    }

    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.updateIndex = () => curIndex = Math.round(tl.progress() * (items.length - 1));
    tl.times = times;
    tl.progress(1, true).progress(0, true); 

    if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
    }
    return tl;
}

const worldwideHolder = document.querySelectorAll('.worldwide__list-holder');
worldwideHolder.forEach(item => {
    const worldwideDesc = item.querySelector('.worldwide__desc');
    const worldwideButton = item.querySelector('.worldwide__btn');
    const more = item.querySelector('.worldwide__btn--more');
    const less = item.querySelector('.worldwide__btn--less');

    worldwideButton.addEventListener("click", function () {
        worldwideDesc.classList.toggle("worldwide__desc-elypsis");

        if (more.style.display !== "none") {
            more.style.display = "none";
            less.style.display = "block";
        } else {
            less.style.display = "none";
            more.style.display = "block";
        }
    });
})



// teacher swiper
var teacherSwiper = new Swiper(".teacher__swiper", {
    slidesPerView: 1.4,
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
    breakpoints: {
        576: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 45,
        }
    },
    navigation: {
        nextEl: ".teacher__next-button",
        prevEl: ".teacher__prev-button",
    },
    pagination: {
        el: ".teacher__pagination",
        clickable: true,
    },
});

const teacherSlides = document.querySelectorAll('.teacher__swiper-slide');
teacherSlides.forEach(slide => {
    const teacherDesc = slide.querySelector('.teacher__description');
    const teacherButton = slide.querySelector('.teacher__btn');
    const teacherCollege = slide.querySelector('.teacher__college');
    const more = slide.querySelector('.teacher__btn--more');
    const less = slide.querySelector('.teacher__btn--less');

    teacherButton.addEventListener("click", function () {
        if (more.style.display !== "none") {
            more.style.display = "none";
            less.style.display = "block";
            teacherDesc.style.display = "block";
            teacherCollege.style.color = "#1C2F70";
        } else {
            less.style.display = "none";
            more.style.display = "block";
            teacherDesc.style.display = "none";
            teacherCollege.style.color = "#696969";
        }
    });
})

// success swiper
var successSwiper = new Swiper(".success__swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    // grabCursor: true,
    // autoHeight: true,
    loop: true,
    navigation: {
        nextEl: ".success__next-button",
        prevEl: ".success__prev-button",
    },
    pagination: {
        el: ".success__pagination",
        clickable: true,
    },
});

// other student swiper
var otherSwiper = new Swiper(".other-student__swiper", {
    slidesPerView: 1.2,
    spaceBetween: 30,
    grabCursor: true,
    autoHeight: true,
    loop: true,
    navigation: {
        nextEl: ".other-student__next-button",
        prevEl: ".other-student__prev-button",
    },
    pagination: {
        el: ".other-student__pagination",
        clickable: true,
    },
    breakpoints: {
        576: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4
        }
    },
});

// portfolio swiper
var portfolioSwiper = new Swiper(".portfolio__swiper", {
    slidesPerView: 1.5,
    spaceBetween: 10,
    grabCursor: true,
    loop: true,
    breakpoints: {
        576: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        992: {
            slidesPerView: 4,
            spaceBetween: 35,
        }
    },
    navigation: {
        nextEl: ".portfolio__next-button",
        prevEl: ".portfolio__prev-button",
    },
    pagination: {
        el: ".portfolio__pagination",
        clickable: true,
    },
});

// add banner padding top
// function addBannerPadding() {
//     const navbarHeight = document.querySelector(".navbar").offsetHeight + 20;
//     const banner = document.querySelector(".banner");
//     banner.style.paddingTop = navbarHeight + "px";
// }


// curriculum nav section placement when mobile
function curriculumNavPlacement() {
    const curriculumNavWrapper = document.querySelector('.curriculum__nav-wrapper');
    const curriculumNav = document.querySelector('.curriculum__nav');
    const curriculumNavCollapse = document.querySelector('#curriculumNavCollapse');

    if (window.innerWidth < 768) {
        curriculumNavCollapse.append(curriculumNav);
    } else {
        curriculumNavWrapper.append(curriculumNav);
    }
}

// matchHeight js init
$('.curriculum__card').matchHeight();
$('.teacher__info').matchHeight();
$('.portfolio__project').matchHeight();
$('.portfolio__name').matchHeight();
$('.why-us__content').matchHeight();

document.addEventListener("DOMContentLoaded", function () {
    // banner section
    //addBannerPadding();

    // curriculum section
    curriculumNavPlacement();

    // video player at trial section
    const videoHolders = document.querySelectorAll('.trial__video-holder');
    videoHolders.forEach(holder => {
        const videoWrapper = holder.querySelector('.trial__video-wrapper');
        const playButton = holder.querySelector('.videoPlayButton');
        const videoThumbnail = holder.querySelector('.videoThumbnail');
        const videoIframe = holder.querySelector('.videoIframe');
        const videoLocal = holder.querySelector('.videoLocal');
        playButton.addEventListener('click', () => {
            if(videoIframe != null) {
                videoIframe.src += "?autoplay=1";
                
                $(videoThumbnail).fadeOut(500, function() {
                    $(this).remove();
                });
            } else {
                videoLocal.autoplay = true;
                videoLocal.load();
            }

            $(playButton).fadeOut(300, function() {
                $(this).remove();
            });
            
            videoWrapper.classList.add('video-play');
        })
    });

    // curriculum select placeholder
    const allCurriculum = document.querySelectorAll('.curriculum__nav-link')[0].innerHTML;
    document.querySelector('#curriculumPlaceholder').innerHTML = allCurriculum;
    
    document.querySelectorAll('.curriculum__nav-link').forEach(item => {
        item.addEventListener('click', event => {
            document.querySelector('#curriculumPlaceholder').innerHTML = event.target.innerHTML;
        })
    })

    // disable toggle modal when slide
    const portfolioModalCard = $('.portfolio__card');
    portfolioSwiper.on('touchMove', () => {
        portfolioModalCard.each(function() {
            $(this).attr('data-bs-toggle', '');
        })
    }).on('transitionEnd', () => {
        portfolioModalCard.each(function() {
            $(this).attr('data-bs-toggle', 'modal');
        })
    });

    // why kids section accordion images
    const collapseButton = document.querySelectorAll('.why-kids__collapse-button');
    collapseButton.forEach(item => {
        // select image element
        const imageElement = document.querySelector('.why-kids__image');

        // get default image value
        const imageUrl = accordionJson[0].image_url;

        // pass value into image element
        imageElement.src = imageUrl;

        item.addEventListener('click', event => {
            // get data image index attribute
            const accordionid = item.getAttribute("data-image");

            // get image value
            const imageUrl = accordionJson[accordionid].image_url;

            // pass value into image element
            imageElement.src = imageUrl;
        });
    });

    // curriculum modal
    const allCurriculumCard = document.querySelectorAll('.allCurriculumLink');
    allCurriculumCard.forEach(item => {
        item.addEventListener('click', event => {
            // get data curriculum attribute
            const curriculumID = item.getAttribute("data-curriculum");
            const result = curriculumAllJson.find(item => item.curriculumID === curriculumID);
            // // select modal element
            const modalCurriculumName = $('.modal-curriculum__title');
            const modalCurriculumCategory = $('.curriculumCategories');
            const modalCurriculumOtherImage = $('.curriculumModalOtherImage');
            const modalCurriculumDescription = $('.curriculumDescription');
            const modalCurriculumSwiperWrapper = $('.modal-curriculum__swiper-wrapper');
            let modalCurriculumSwiper = null;

            // // get curriculum value
            const name = result.curriculum_name;
            const categories = result.categories;
            const mainImage = result.main_image;
            const otherImage = result.other_image;
            const description = result.description;
            const color = curriculumCategoriesColor;
            
            // add value into modal section
            modalCurriculumName.html(name);
            modalCurriculumDescription.html(description);
            if(categories) {
                categories.forEach( (category) => {
                    modalCurriculumCategory.append(
                        `<span class="modal-curriculum__category-text">${category.name}</span>`
                    );
                });
            }

            if(otherImage){
                otherImage.forEach((item) => {
                    modalCurriculumSwiperWrapper.append(
                        `<div class="swiper-slide">
                            <div class="modal-curriculum__image-container">
                                <img class="modal-curriculum__image" src="${item.url}" alt="${item.alt}">
                            </div>
                        </div>`
                    );
                });
            }

            // clear image when modal close
            $('#curriculumModal').on('hidden.bs.modal', function () {
                if (swiperCurriculum) {
                    swiperCurriculum.destroy(true, true);
                    swiperCurriculum = null;
                }

                modalCurriculumSwiperWrapper.html('');
                modalCurriculumCategory.html('');
                modalCurriculumMainImage.html('');
                modalCurriculumOtherImage.html('');
            });

            let swiperCurriculum = null;
            $('#curriculumModal').on('shown.bs.modal', function () {
                swiperCurriculum = new Swiper(".swiper-curriculum", {
                    slidesPerView: 1.3,
                    spaceBetween: 30,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                    },
                });
            });
        })
    });

    // curriculum modal
    const curriculumCard = document.querySelectorAll('.curriculumLink');
    curriculumCard.forEach(item => {
        item.addEventListener('click', event => {
            // get data curriculum attribute
            const curriculumTab = item.closest(".tabPaneCurriculum").getAttribute("data-tab");
            const curriculumId = item.getAttribute("data-curriculum");
            const curriculumSlug = item.getAttribute("data-curriculum-slug");

            // select modal element
            const modalCurriculumName = $('.modal-curriculum__title');
            const modalCurriculumCategory = $('.curriculumCategories');
            const modalCurriculumMainImage = $('.curriculumModalMainImage');
            const modalCurriculumOtherImage = $('.curriculumModalOtherImage');
            const modalCurriculumDescription = $('.curriculumDescription');

            // get curriculum value
            const name = curriculumJson[curriculumSlug][curriculumId].curriculum_name;
            const categories = curriculumJson[curriculumSlug][curriculumId].categories;
            const mainImage = curriculumJson[curriculumSlug][curriculumId].main_image;
            const otherImage = curriculumJson[curriculumSlug][curriculumId].other_image;
            const description = curriculumJson[curriculumSlug][curriculumId].description;
            const color = curriculumCategoriesColor;
            
            // add value into modal section
            modalCurriculumName.html(name);
            modalCurriculumDescription.html(description);
            modalCurriculumMainImage.append(
                `<img src="${mainImage.url}" class="modal-curriculum__image" alt="coding curriculum image">`
            );
            modalCurriculumOtherImage.append(
                `<img src="${otherImage.url}" class="modal-curriculum__image" alt="coding curriculum image">`
            );
            if(categories) {
                categories.forEach( (category) => {
                    modalCurriculumCategory.append(
                        `<span class="modal-curriculum__category-text" style="background: ${color[category.slug]};">${category.name}</span>`
                    );
                });
            }

            // clear image when modal close
            $('#curriculumModal').on('hidden.bs.modal', function () {
                modalCurriculumCategory.html('');
                modalCurriculumMainImage.html('');
                modalCurriculumOtherImage.html('');
            });
        });
    });

    // portfolio modal
    const portfolioCard = document.querySelectorAll('.portfolioLink');
    portfolioCard.forEach(item => {
        // Get Youtube Id
        function youtube_parser(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match && match[7].length == 11) ? match[7] : false;
        }

        item.addEventListener('click', event => {
            // get data portfolio attribute
            const portfolioid = item.getAttribute("data-portfolio");

            // select modal element
            const modalPortfolioName = $('.modal-portfolio__title');
            const modalPortfolioCategory = $('.portfolioCategories');
            const modalPortfolioStudent = $('.modal-portfolio__name');
            const modalPortfolioLink = $('.modal-portfolio__view-detail');
            const modalPortfolioDescription = $('.portfolioDescription');
            const modalPortfolioVideoWrapper = $('.modalPortfolioVideoWrapper');

            // get portfolio value
            const categories = portfolioJson[portfolioid].categories;
            const projectName = portfolioJson[portfolioid].project_name;
            const studentName = portfolioJson[portfolioid].student_name;
            const studentAge = portfolioJson[portfolioid].student_age;
            const permalink = portfolioJson[portfolioid].permalink;
            const videoUrl = youtube_parser(portfolioJson[portfolioid].video_url);
            const videoFile = portfolioJson[portfolioid].video_file;
            const description = portfolioJson[portfolioid].description;
            const googlePlayDownload = portfolioJson[portfolioid].google_play_download;
            const color = portfolioCategoriesColor;
            
            // get local image
            const modalPlayButton = portfolioJson[portfolioid].play_button;
            const imageNotFound = portfolioJson[portfolioid].image_not_found;
            const googlePlayImage = portfolioJson[portfolioid].google_play_image;
            
            // add value into modal section
            modalPortfolioName.html(projectName);
            modalPortfolioStudent.html(`${studentName} (${studentAge})`);
            modalPortfolioLink.attr("href", `${permalink}`);
            if(googlePlayDownload && description) {
                modalPortfolioDescription.html(
                    `<div class="col-lg-7">
                        <div class="theme-text">
                            ${description}
                        </div>
                    </div>
                    <div class="col-lg-5 d-flex justify-content-center justify-content-lg-end">
                        <a href="${googlePlayDownload}" class="modal-portfolio__google-play-button" target="_blank">
                            <img src="${googlePlayImage}" class="modal__google-play-image" alt="google play image">
                        </a>
                    </div>`
                );
            } else {
                modalPortfolioDescription.html(
                    `<div class="col-lg-12">
                        <div class="theme-text">
                            ${description}
                        </div>
                    </div>`
                );
            }
            if(categories) {
                categories.forEach( (category) => {
                    modalPortfolioCategory.append(
                        `<span class="portfolio__category-text modal-portfolio__badge" style="background: ${color[category.slug]};">${category.name}</span>`
                    );
                });
            }
            if(videoUrl) {
                modalPortfolioVideoWrapper.html(
                    `<iframe class="embed-responsive-item trial__iframe modalPortfolioIframe" src="https://www.youtube.com/embed/${videoUrl}" allowfullscreen allow="autoplay"></iframe>
                    <img class="trial__video-thumbnail modalPortfolioThumbnail" src="http://img.youtube.com/vi/${videoUrl}/maxresdefault.jpg" alt="video cover">
                    <img class="trial__video-play modalPortfolioPlayButton" src="${modalPlayButton}" alt="play button"></img>`
                )
            } else if(videoFile) {
                modalPortfolioVideoWrapper.html(
                    `<video class="modalPortfolioVideoFile" id="player" controls="controls">
                        <source src="${videoFile}" type="video/mp4">
                    </video>
                    <img class="trial__video-play modalPortfolioPlayButton" src="${modalPlayButton}" alt="play button"></img>`
                )
            } else {
                modalPortfolioVideoWrapper.html(
                    `<div class="modal-portfolio__not-found">
                        <img src="${imageNotFound}" class="modal-portfolio__not-found-image" alt="">
                    </div>`
                )
            }

            // video player at portfolio modal section
            const playButton = document.querySelector('.modalPortfolioPlayButton');
            const videoThumbnail = document.querySelector('.modalPortfolioThumbnail');
            const videoIframe = document.querySelector('.modalPortfolioIframe');
            const videoLocal = document.querySelector('.modalPortfolioVideoFile');
            const modalPortfolioNotFound = document.querySelector('.modal-portfolio__not-found');

            // play button action
            if(videoUrl || videoFile) {
                playButton.addEventListener('click', () => {
                    if(videoIframe) {
                        videoIframe.src += "?autoplay=1";
                        
                        $(videoThumbnail).fadeOut(500, function() {
                            $(this).remove();
                        });
                    } else if(videoLocal) {
                        videoLocal.autoplay = true;
                        videoLocal.load();
                    }
    
                    $(playButton).fadeOut(300, function() {
                        $(this).remove();
                    });
                    
                    modalPortfolioVideoWrapper[0].classList.add('modal-video-play');
                })
            }

            // clear modal value when modal close
            $('#portfolioModal').on('hidden.bs.modal', function () {
                modalPortfolioCategory.html('');
                modalPortfolioName.html('');
                modalPortfolioStudent.html('');
                modalPortfolioLink.href = '';
                modalPortfolioDescription.html('');
                if(videoIframe) {
                    videoIframe.remove();
                    videoThumbnail.remove();
                } else if(videoLocal) {
                    videoLocal.remove();
                } else {
                    modalPortfolioNotFound.remove();
                }
                if(playButton) {
                    playButton.remove();
                }
                modalPortfolioVideoWrapper[0].classList.remove("modal-video-play");
            });
        })
    });

    // why us click on mobile
    if(window.innerWidth <= 991) {
        const whyUsList = document.querySelectorAll('.why-us__col');
        whyUsList.forEach(list => {
            const button = list.querySelector('.why-us__btn-mobile');
            button.addEventListener('click', () => {
                list.classList.toggle('active');
            })
        })
    }

    // add space when scrollbar visible in curriculum__nav
    const container = document.querySelector('.curriculum__nav');
    function updateScrollbarSpacing() {
        if (container.scrollWidth > container.clientWidth) {
            container.classList.add('has-scrollbar');
        } else {
            container.classList.remove('has-scrollbar');
        }
    }
    window.addEventListener('resize', updateScrollbarSpacing);
    updateScrollbarSpacing();
});

window.addEventListener('resize', function (event) {
    // banner section
    //addBannerPadding();
    // bannerAssetPlacement();

    // curriculum section
    curriculumNavPlacement();
});


function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

console.log(isValidEmail("agus@gmail.com"));


// remove data-bs-parent on mobile
if (window.innerWidth <= 767) {
    collapseButton = document.querySelectorAll('.accordion-collapse');
    collapseButton.forEach(collapse => {
        collapse.removeAttribute('data-bs-parent')
    });
}
