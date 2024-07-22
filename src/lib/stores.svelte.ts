function createModeWatcher() {
    let mode = $state('system'); // 'light' | 'dark' | 'system'
    let isStorage = $state('');

    return {
        get mode() {
            if ($effect.tracking() && !localStorage.getItem('theme')) {
                $effect(() => {
                    mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    const interval = setInterval(() => {
                        isStorage = window.localStorage.getItem('theme') ?? '';
                        if (isStorage) {
                            mode = isStorage;
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
