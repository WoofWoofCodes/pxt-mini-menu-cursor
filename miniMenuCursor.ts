
namespace miniMenu {
    let menuCursorX: number
    let menuCursorY: number

    /**
     * An array of all menu sprites
     */
    //% block="all menus"
    //% blockId="menu_cursor_all_menus"
    //% group="Cursor"
    export function allMenus() { // so that I can get the array of menu sprites even if their 'spriteType' has been changed
        return miniMenu._state().sprites
    }

    /**
     * Updates the selected index of all menu that have button events enabled and the cursor (x/y) is touching or within scroll range of.
     * To use as intended, place inside the Browser Events 'On Mouse Move' block with X and Y dragged inside
     */
    //% block="update menu position to cursor x $x y $y"
    //% blockId="menu_cursor_update_position"
    //% group="Cursor"
    //% weight=5
    export function updateMenuPosition(x: number, y: number) {
        menuCursorX = x // used elsewhere
        menuCursorY = y
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled) continue
            if (menu.left > x || menu.right < x) continue

            let menuPos = menu.top
            menuPos += menu.title ? menu.title.getHeight(menu.titleStyle) : 0
            menuPos += menu.frame ? menu.frame.height / 3 : 0
            menuPos += menu.menuStyle.padding

            if (menuPos - 12 > y || menu.bottom + 12 < y) continue // extra detected space above and below allows for easier scrolling

            menuPos -= menu.yScroll

            if (menuPos > y) continue // prevents extra detected space from working if the menu has no scroll

            let posInMenu = 0
            for (let item of menu.items) {
                menuPos += item.getHeight(menu.selectedStyle)
                if (menuPos >= y) break
                posInMenu++
            }

            if (posInMenu >= 0 && posInMenu < menu.items.length) {
                menu.selectedIndex = posInMenu
            }
        }
    }

    /**
     * Simulates the specified button being pressed for all menus that are touching the cursor and have button events enabled
     * To use as intended, place inside the Browser Events 'On [ ] Mouse Button clicked' block with X and Y dragged inside, and set the button to whichever button should get pressed when the selected mouse button is pressed
     */
    //% block="click menu with $button at cursor position x $x y $y"
    //% blockId="menu_cursor_click_position"
    //% group="Cursor"
    //% weight=4
    export function clickMenuAtPosition(button: controller.Button, x: number, y: number) {
        menuCursorX = x // used in the scrollMenu function
        menuCursorY = y
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled || menu.left > x || menu.right < x) continue

            let menuPos = menu.top
            menuPos += menu.title ? menu.title.getHeight(menu.titleStyle) : 0
            menuPos += menu.frame ? menu.frame.height / 3 : 0
            menuPos += menu.menuStyle.padding

            if (menuPos > y || menu.bottom < y) continue

            menuPos -= menu.yScroll

            let posInMenu = 0
            for (let item of menu.items) {
                menuPos += item.getHeight(menu.selectedStyle)
                if (menuPos >= y) break
                posInMenu++
            }

            if (posInMenu >= 0 && posInMenu < menu.items.length) {
                menu.selectedIndex = posInMenu
                pressMenuButton(menu, button)
            }
        }
    }

    export enum MenuScroll {
        Up = -1,
        Down = 1
    }

    /**
     * Change the selected position of all menus that are touching the cursor and have button events enabled
     */
    //% block="scroll menus $dir"
    //% blockId="menu_cursor_scroll"
    //% group="Cursor"
    //% weight=2
    export function scrollMenus(dir: MenuScroll) {
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled || menu.left > menuCursorX || menu.right < menuCursorX || menu.top > menuCursorY || menu.bottom < menuCursorY) continue

            if (menu.selectedIndex + dir < menu.items.length && menu.selectedIndex + dir >= 0) {
                menu.selectedIndex += dir
            }
        }
    }

    /**
     * Simulate a button click for the specified menu
     */
    //% block="$menu=variables_get(myMenu) simulate click of button $button"
    //% blockId="menu_cursor_simulate_menu_click"
    //% group="Cursor"
    //% weight=1
    export function pressMenuButton(menu: MenuSprite, button: controller.Button) {
        menu.fireButtonEvent(button)
    }

    /**
     * Simulate a button click
     */
    //% block="simulate click of button $button"
    //% blockId="menu_cursor_simulate_click"
    //% group="Cursor"
    //% weight=0
    export function pressButton(button: ControllerButton) {
        control.raiseEvent(INTERNAL_KEY_DOWN, button)
        control.raiseEvent(INTERNAL_KEY_UP, button)
    }
}