function createModeWatcher() {
    let mode = $state('system'); // 'light' | 'dark' | 'system'
    let followSystem = true;

    return {
        get mode() {
            if ($effect.tracking() && !localStorage.getItem('theme')) {
                $effect(() => {
                    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    const interval = setInterval(() => {
                        isStorage = window.localStorage.getItem('theme') ?? '';
                        if (isStorage) {
                            mode = isStorage;
                            followSystem = false;
                        } else {
                            mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                        }
                    }, 300);

                    return function stop() {
                        clearInterval(interval);
                    };
                });
            }
            return mode;
        },
        light: () => {
            mode = 'light';
            localStorage.setItem('theme', mode);
        },
        dark: () => {
            mode = 'dark';
            localStorage.setItem('theme', mode);
        },
        system: () => {
            mode = 'system';
            localStorage.removeItem('theme');
        },
        custom: (value: string) => {
            mode = 'value';
            localStorage.setItem('theme', mode);
        }
    }
}

export const modeWatcher = createModeWatcher();

let mode = $state('system');
let contextMode = $state();
let isStorage = $state('');
let readableMode = $state(true)

export const theme = {
    get mode() {
        let modeFromStorage = $derived(localStorage.getItem('theme'))
        $inspect(modeFromStorage);
        console.log("test", modeFromStorage);
        if ($effect.tracking()) {
            if (modeFromStorage) {
                mode = localStorage.getItem('theme') ?? 'system';
                console.log("tracking and item");
            } else {
                console.log("tracking and no item");
            }
        }

        /*         if ($effect.tracking() && localStorage.getItem('theme')) {
                    contextMode = localStorage.getItem('theme');
                    console.log("here", mode, "cm", contextMode, isBrowser, "is", isStorage);
                } else {
                    console.log("not here", mode, "cm", contextMode, isBrowser, isStorage);
                }
        
                if ($effect.tracking() && !localStorage.getItem('theme')) {
                    $effect(() => {
                        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                        const interval = setInterval(() => {
                            isStorage = window.localStorage.getItem('theme') ?? '';
                            if (isStorage) {
                                mode = isStorage;
                                followSystem = false;
                            } else {
                                mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                            }
                        }, 300);
        
                        return function stop() {
                            clearInterval(interval);
                        };
                    });
        
                } else {
                    mode = localStorage.getItem('theme') ?? 'system';
                } */
        return mode;
    },
    system: () => {
        readableMode = false;
        window.localStorage.removeItem('theme');
    },
    light: () => {
        mode = 'light';
        readableMode = true;
        window.localStorage.setItem('theme', mode);
    },
    dark: () => {
        mode = 'dark';
        readableMode = true;
        window.localStorage.setItem('theme', mode);
    }
};
