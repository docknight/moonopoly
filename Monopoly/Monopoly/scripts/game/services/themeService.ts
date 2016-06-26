module Services {
    export class ThemeService implements Interfaces.IThemeService {

        // TODO: move this to build-time variable
        private static theme: Model.Themes = 1/*Model.Themes.Moonopoly*/;

        private themeInstance: Interfaces.ITheme;

        constructor() {
            if (ThemeService.theme === Model.Themes.Monopoly) {
                this.themeInstance = new Model.MonopolyTheme();
            } else if (ThemeService.theme === Model.Themes.Moonopoly) {
                this.themeInstance = new Model.MoonopolyTheme();
            }            
        }

        get theme(): Interfaces.ITheme {
            return this.themeInstance;
        }
    }
}

monopolyApp.service("themeService", Services.ThemeService);