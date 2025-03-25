// Apparently 'right click' on Mac (two finger click on track pad) is actually the wheel button.
browserEvents.MouseWheel.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    miniMenu.clickMenuAtPosition(ControllerButton.B, x, y)
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    miniMenu.clickMenuAtPosition(ControllerButton.A, x, y)
})
browserEvents.onWheel(function (dx, dy, dz) {
    if (dy > 0) {
        for (let index = 0; index < dy / 2; index++) {
            // Switch these around to change the scroll direction!
            miniMenu.scrollUp()
        }
    } else if (dy < 0) {
        for (let index = 0; index < Math.abs(dy) / 2; index++) {
            miniMenu.scrollDown()
        }
    }
})
browserEvents.onMouseMove(function (x, y) {
    miniMenu.updateMenuPosition(x, y)
})
browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    miniMenu.clickMenuAtPosition(ControllerButton.B, x, y)
})
function Create_sub_menu(Number2: number) {
    menu2 = miniMenu.createMenu(
        miniMenu.createMenuItem("back"),
        miniMenu.createMenuItem("1"),
        miniMenu.createMenuItem("2"),
        miniMenu.createMenuItem("3"),
        miniMenu.createMenuItem("4"),
        miniMenu.createMenuItem("5"),
        miniMenu.createMenuItem("6"),
        miniMenu.createMenuItem("7"),
        miniMenu.createMenuItem("8"),
        miniMenu.createMenuItem("9"),
        miniMenu.createMenuItem("10"),
        miniMenu.createMenuItem("11")
    )
    menu2.setDimensions(80, 50)
    menu2.setTitle("Sub Menu #" + Number2 + ":")
    menu2.setPosition(125, 66)
    menu2.onButtonPressed(controller.A, function (selection, selectedIndex) {
        menu2.sayText(selectedIndex, 1000, false)
        if (selectedIndex == 0) {
            menu2.close()
            myMenu.setButtonEventsEnabled(true)
        }
    })
    menu2.onButtonPressed(controller.B, function (selection, selectedIndex) {
        menu2.close()
        myMenu.setButtonEventsEnabled(true)
    })
}
let menu2: miniMenu.MenuSprite = null
let myMenu: miniMenu.MenuSprite = null
myMenu = miniMenu.createMenu(
    miniMenu.createMenuItem("0"),
    miniMenu.createMenuItem("1"),
    miniMenu.createMenuItem("2"),
    miniMenu.createMenuItem("3"),
    miniMenu.createMenuItem("4"),
    miniMenu.createMenuItem("5"),
    miniMenu.createMenuItem("6"),
    miniMenu.createMenuItem("7"),
    miniMenu.createMenuItem("8"),
    miniMenu.createMenuItem("9"),
    miniMenu.createMenuItem("10"),
    miniMenu.createMenuItem("11")
)
myMenu.setTitle("Works with cursor!")
myMenu.setFlag(SpriteFlag.RelativeToCamera, true)
myMenu.setDimensions(114, 70)
myMenu.setPosition(63, 63)
myMenu.onButtonPressed(controller.A, function (selection, selectedIndex) {
    myMenu.sayText(selectedIndex, 1000, false)
    myMenu.setButtonEventsEnabled(false)
    Create_sub_menu(selectedIndex)
})