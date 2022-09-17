var isMobile = false;
(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) isMobile = true;})(navigator.userAgent||navigator.vendor||window.opera);

document.querySelector('#content').addEventListener('touchstart', e => {
    if (isMobile) {
        nextTheme();
    }
}, false);

// disable theme change timeout if a link is clicked
// it's jarring to come back and the theme is different
window.onload = () => {
    let links = document.querySelectorAll('a');
    links.forEach(l => {
        l.addEventListener('touchstart', () => {
            isLink = true;
        });
    });
    // set favicon on page load
    setFavicon();
};

var themes = undefined;
var themeIndex = undefined;

// load theme list from json file
loadThemeList('theme-list.json');
function loadThemeList(filename) {
    fetch(`css/themes/${filename}`)
        .then(response => {
            if (response.status === 200) {
                response
                    .text()
                    .then(body => {
                        let themeList = JSON.parse(body);
                        themes = themeList.themes;

                        if (themes === undefined) {
                            console.error(`no themes defined in ${filename}`);
                        } else {
                            if (themes.length > 0) {
                                themeIndex = 0;

                                // TODO: no room on mobile :(
                                if (screen.width >= 860) {
                                    // show the 'change theme' button for 3s
                                    // time when the page is loaded
                                    let elem = document.querySelector('#current-theme');
                                    setTimeout(() => {
                                        elem.style.opacity = 1;
                                        setTimeout(() => {
                                            elem.style.opacity = '';
                                        }, 3000);
                                    }, 750);
                                }
                            } else {
                                console.error(`no themes defined in ${filename}`);
                            }
                        }
                    })
                    .catch(err => console.error(err));
            } else {
                console.error(`${filename} is not found`);
            }
        })
        .catch(err => console.error(err));
}

function setTheme(theme) {
    const _theme = theme.toLowerCase();
    fetch(`css/themes/${_theme}.css`)
        .then(response => {
            if (response.status === 200) {
                response
                    .text()
                    .then(_ => {
                        document.querySelector('#theme').setAttribute('href', `css/themes/${theme}.css`);

                        // set current theme text, replacing underscores with line breaks
                        document.querySelector('#current-theme').innerHTML = theme.replace("_", "<br>");
                    })
                    .catch(err => console.error(err));
            } else {
                console.error(`theme ${theme} is not defined`);
            }
        })
        .catch(err => console.error(err));
}

function prevTheme() {
    // check that array has elements
    if (themes.length === 0) {
        console.error('no themes loaded');
        return;
    }

    // if at beginning of array, set index to last member
    if (themeIndex <= 0) {
        themeIndex = themes.length - 1;
    } else {
        themeIndex--;
    }

    setTheme(themes[themeIndex]);
}

function nextTheme() {
    // check that rray has elements
    if (themes.length === 0) {
        console.error('no themes loaded');
        return;
    }

    // if at end of array, set index to first member
    if (themeIndex >= themes.length - 1) {
        themeIndex = 0;
    } else {
        themeIndex++;
    }

    setTheme(themes[themeIndex]);
}

// update favicon on transition end
document.querySelector('body').addEventListener('transitionend', setFavicon);
function setFavicon() {
    let canvas = document.createElement('canvas');
    let favicon = document.querySelector('#favicon');
    let context = canvas.getContext('2d');

    // init favicon canvas
    canvas.width = 64; canvas.height = 64;
    canvas.style.position = "absolute";
    canvas.style.visibility = "hidden"

    // draw outer circle
    context.fillStyle = window.getComputedStyle(document.querySelector('body'), null).getPropertyValue('--accent-color');
    context.beginPath();
    context.arc(32, 32, 32, 0, 2 * Math.PI);
    context.fill();
    context.closePath();

    // draw inner circle
    context.fillStyle = window.getComputedStyle(document.querySelector('body'), null).getPropertyValue('--content-background-color');
    context.beginPath();
    context.arc(32, 32, 26, 0, 2 * Math.PI);
    context.fill();

    // nav bar on ios safari
    let backgroundColor = window.getComputedStyle(document.querySelector('body'), null).getPropertyValue('--background-color');
    document.getElementById('navcolor').setAttribute('content', backgroundColor);

    favicon.href = canvas.toDataURL();
}
