// Apparently 'right click' on Mac (two finger click on track pad) is actually the wheel button.
browserEvents.MouseWheel.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    miniMenu.clickMenuAtPosition(controller.B, x, y)
})
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    miniMenu.clickMenuAtPosition(controller.A, x, y)
})
browserEvents.onWheel(function (dx, dy, dz) {
    if (dy > 0) {
        for (let index = 0; index < dy / 2; index++) {
            // Switch these around to change the scroll direction!
            miniMenu.scrollMenus(-1)
        }
    } else if (dy < 0) {
        for (let index = 0; index < Math.abs(dy) / 2; index++) {
            miniMenu.scrollMenus(1)
        }
    }
})
browserEvents.onMouseMove(function (x, y) {
    miniMenu.updateMenuPosition(x, y)
})
browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    miniMenu.clickMenuAtPosition(controller.B, x, y)
})
function Create_sub_menu(num: number) {
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
    menu2.setTitle("Sub Menu #" + num + ":")
    menu2.setPosition(125, 66)
    menu2.setFlag(SpriteFlag.RelativeToCamera, true)
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
let menu3: miniMenu.MenuSprite = null
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
myMenu.setTitle(":)")
myMenu.menuStyle.columns = 1
myMenu.menuStyle.rows = 0

myMenu.setDimensions(30, 50)
myMenu.setPosition(75, 40)
myMenu.onButtonPressed(controller.A, function (selection, selectedIndex) {
    myMenu.sayText(selectedIndex, 1000, false)
    myMenu.setButtonEventsEnabled(false)
    Create_sub_menu(selectedIndex)
})
let camera = sprites.create(img`.`)
scene.cameraFollowSprite(camera)
controller.moveSprite(camera)



let rowMenu = miniMenu.createMenu(
    miniMenu.createMenuItem("2"),
    miniMenu.createMenuItem("4"),
    miniMenu.createMenuItem("6"),
    miniMenu.createMenuItem("8"),
    miniMenu.createMenuItem("10"),
    miniMenu.createMenuItem("12!"),
)
rowMenu.menuStyle.columns = 0
rowMenu.menuStyle.rows = 1
rowMenu.setTitle("Woah!")

rowMenu.setDimensions(40, 30)
rowMenu.setPosition(25, 40)
rowMenu.onButtonPressed(controller.A, function (selection, selectedIndex) {
    rowMenu.sayText(selectedIndex, 1000, false)
})

let gridMenu = miniMenu.createMenu(
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
gridMenu.menuStyle.columns = 3
gridMenu.menuStyle.rows = 3

gridMenu.setDimensions(50, 50)
gridMenu.setPosition(30, 88)
gridMenu.onButtonPressed(controller.A, function (selection, selectedIndex) {
    gridMenu.sayText(selectedIndex, 1000, false)
})