function collision({
    object1,
    object2,
}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    )
}
function platformCollision({
    object1,
    object2,
    dropDown,
}) {
    if (dropDown == true) return false
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y + object1.height-2 <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    )
}

