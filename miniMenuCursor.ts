
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

            let xx = x + ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.X) - (scene.screenWidth() / 2)) // adjust position if not relative to camera
            let yy = y + ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.Y) - (scene.screenHeight() / 2))
            
            let isHorizontal = (menu.menuStyle.columns == 0 && menu.menuStyle.rows == 1)
            if (!isHorizontal && (menu.left > xx || menu.right < xx)) continue
            else if (isHorizontal && (menu.left - 12 > xx || menu.right + 12 < xx)) continue

            let menuPos = menu.top
            menuPos += menu.title ? menu.title.getHeight(menu.titleStyle) : 0
            menuPos += menu.frame ? menu.frame.height / 3 : 0
            menuPos += menu.menuStyle.padding

            if (!isHorizontal && (menuPos - 12 > yy || menu.bottom + 12 < yy)) continue // extra detected space above and below allows for easier scrolling
            else if (isHorizontal && (menuPos > yy || menu.bottom < yy)) continue
            menuPos -= menu.yScroll

            if (menuPos > yy) continue // prevents extra detected space from working if the menu has no scroll

            let posInMenu = 0

            let previousPosition = menu.selectedIndex

            if (menu.menuStyle.columns == 0 && menu.menuStyle.rows == 1) { // single row left/Right
                menuPos = menu.left + (menu.frame ? menu.frame.height / 3 : 0) + menu.menuStyle.padding
                menuPos -= menu.xScroll
                
                //let width = menu.width
                //width -= menu.frame ? menu.frame.height / 3 * 2 : 0
                //width -= menu.menuStyle.padding * 2

                for (let item of menu.items) {
                    menuPos += item.getWidth(menu.defaultStyle)//width / item.getWidth(menu.selectedStyle)
                    if (menuPos >= xx) break
                    posInMenu++
                }

                if (posInMenu >= 0 && posInMenu < menu.items.length) {
                    menu.selectedIndex = posInMenu
                    if (menu.selectedIndex >= menu.items.length) menu.selectedIndex = (menu.items.length - 1)
                }

            } else if (menu.menuStyle.columns <= 1 && menu.menuStyle.rows <= 1) { // normal single column case
                for (let item of menu.items) {
                    menuPos += item.getHeight(menu.selectedStyle)
                    if (menuPos >= yy) break
                    posInMenu++
                }
                
                if (posInMenu >= 0 && posInMenu < menu.items.length) {
                    menu.selectedIndex = posInMenu
                    if (menu.selectedIndex >= menu.items.length) menu.selectedIndex = (menu.items.length - 1)
                }

            } else { // grid case
                let height = menu.height //(menu.bottom - (menu.frame ? menu.frame.height / 3 : 0) - menu.menuStyle.padding) - menuPos
                height -= menu.title ? menu.title.getHeight(menu.titleStyle) : 0
                height -= menu.frame ? menu.frame.height / 3 * 2 : 0
                height -= menu.menuStyle.padding * 2
                
                let width = menu.width
                width -= menu.frame ? menu.frame.height / 3 * 2 : 0
                width -= menu.menuStyle.padding * 2
                
                for (let item of menu.items) {
                    //let bottom = menu.bottom - (menu.frame ? menu.frame.height / 3 : 0) - menu.menuStyle.padding
                    menuPos += height / (menu.menuStyle.rows ? menu.menuStyle.rows : 1) //(menuPos - (menu.bottom - (menu.frame ? menu.frame.height / 3 : 0) - (menu.menuStyle.padding))) / (menu.menuStyle.columns ? menu.menuStyle.columns : 1)
                    if (menuPos >= yy) break
                    posInMenu += menu.menuStyle.columns
                }
                
                while (((posInMenu) % menu.menuStyle.columns + 1) * (width / menu.menuStyle.columns) < xx - menu.left - (menu.frame ? menu.frame.height / 3 : 0) - menu.menuStyle.padding) {
                    posInMenu++
                    if (posInMenu > menu.items.length) break // fail state. If I did my math right, this should never happen, but if it does I want to prevent freezing.
                }

                if (posInMenu >= 0 && posInMenu < menu.items.length) {
                    menu.selectedIndex = posInMenu
                    if (menu.selectedIndex >= menu.items.length) menu.selectedIndex = (menu.items.length - 1) - (menu.items.length - 1) % menu.menuStyle.columns
                }
            }

            if (menu['itemSelectedHandler'] && menu.selectedIndex != previousPosition) {
                menu['itemSelectedHandler'](menu.items[menu.selectedIndex].text, menu.selectedIndex)
            }

            /*if (posInMenu >= 0 && posInMenu < menu.items.length) {
                menu.selectedIndex = posInMenu//(menu.menuStyle.columns > 1) ? (posInMenu * menu.menuStyle.columns) + ((Math.map(xx, menu.left, menu.right, 0, menu.menuStyle.columns)) | 0) : posInMenu
                if (menu.selectedIndex >= menu.items.length) menu.selectedIndex = menu.items.length - 1
            }*/
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
    export function clickMenuAtPosition(button: miniMenu.Button, x: number, y: number) {
        updateMenuPosition(x, y)
        for (let menu of allMenus()) {
            if (!menu.buttonEventsEnabled) continue
            
            let xx = x + ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.X) - (scene.screenWidth() / 2)) // adjust position if not relative to camera
            let yy = y + ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.Y) - (scene.screenHeight() / 2))
            
            let border = (menu.frame ? menu.frame.height / 3 : 0) + menu.menuStyle.padding

            if (menu.left + border > xx || menu.right - border < xx) continue
            if (menu.top + border + (menu.title ? menu.title.getHeight(menu.titleStyle) : 0) > yy || menu.bottom - border < yy) continue
            
            pressMenuButton(menu, button)
            break // This is to prevent instantly clicking a newly created menu
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
            
            if (!menu.buttonEventsEnabled || 
                (menu.left - ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.X) - (scene.screenWidth() / 2)) ) > menuCursorX || 
                (menu.right - ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.X) - (scene.screenWidth() / 2)) ) < menuCursorX || 
                (menu.top - ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.Y) - (scene.screenHeight() / 2)) ) > menuCursorY || 
                (menu.bottom - ((menu.flags & SpriteFlag.RelativeToCamera) ? 0 : scene.cameraProperty(CameraProperty.Y) - (scene.screenHeight() / 2)) ) < menuCursorY) continue

            if (menu.selectedIndex + dir < menu.items.length && menu.selectedIndex + dir >= 0) {
                menu.selectedIndex += dir
                if (menu['itemSelectedHandler']) {
                    menu['itemSelectedHandler'](menu.items[menu.selectedIndex].text, menu.selectedIndex)
                }
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
    export function pressMenuButton(menu: MenuSprite, button: miniMenu.Button) {
        for (const handler of menu['buttonHandlers']['handlers']) {
            if (handler.button == button && handler.event == ControllerButtonEvent.Pressed) {
                handler.handler()
            }
        }
        
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