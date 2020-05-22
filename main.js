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
                    .then(css => {
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
