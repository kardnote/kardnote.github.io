
(function () {
    const selectables = Array.from(document.querySelectorAll('.selectable'))
    SVGDnD.support()
    const svg = SVGDnD.create()
    const user_dblclick = 200
    let clickStack
    // selectables.forEach(
    //     selectable => {
    //         selectable.addEventListener('mousedown', ({ path }) => {
    //             if (clickStack) {
    //                 svg.select(selectables)
    //             } else {
    //                 clickStack = setTimeout(() => {
    //                     clickStack = undefined
    //                 }, user_dblclick)
    //                 const target = path.filter(elem => selectables.indexOf(elem) !== -1)
    //                 svg.select(target)
    //             }
    //         })
    //     }
    // )
    // function dblclick(single, double) {
    //     let clickStack, user_dblclick = 200
    //     return (e) => {
    //         if (clickStack) {
    //             double.call(null, e)
    //         } else {
    //             clickStack = setTimeout(() => {
    //                 clickStack = undefined
    //             }, user_dblclick)
    //             single.call(null, e)
    //         }
    //     }
    // }
})()
