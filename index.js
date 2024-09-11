import { lerp } from "./utils.js"
import { createProjects, createBlogposts } from "./projects.js"

const main = document.querySelector('main')
const video = document.querySelector('video')
const videoSection = document.querySelector('#video')

createProjects()
createBlogposts()

main.addEventListener('scroll', () => {
    animateVideo()

})

// Video
const headerLeft = document.querySelector('.text__header__left')
const headerRight = document.querySelector('.text__header__right')

function animateVideo(){
    let {bottom} = videoSection.getBoundingClientRect()
    // console.log(bottom) // 브라우저 상단과 요소 하단까지의 거리. 스크롤 내리면 요소가 올라오면서 bottom 값은 점점 작아짐
    let diff = bottom - window.innerHeight
    // console.log(diff) // 스크롤 내리다가 더이상 스크롤 내리지 못하고 바닥이면 0. 스크롤 내리는동안 양수값이면서 점점 작아짐.
    // console.log(diff * 0.0005)
    let scale = 1 - diff * 0.0005 // diff 는 양수값(1 -> 0)이면서 점점 작아지므로 scale 값은 점점 커지면서 1에 가까워짐.
    // console.log(scale)
    scale = scale < .2 ? .2 : scale > 1 ? 1 : scale // scale 값을 0.2와 1사이로 제한
    // console.log(scale)
    video.style.transform = `scale(${scale})`

    // Text transformation
    let textTrans = bottom - window.innerHeight // 값이 양수이며 스크롤 내릴때 점점 줄어들다가 비디오 요소가 브라우저 바닥에 닿으면 textTrans 값은 0
    textTrans = textTrans < 0 ? 0 : textTrans // 비디오 요소가 브라우저 상단보다 올라가면 bottom 은 window.innerHeight 보다 작아지므로 textTrans 는 0보다 작아질수 있음. 이때 0으로 제한하지 않으면 글자가 중앙에서 서로 교차하여 지나가버림.
    headerLeft.style.transform = `translateX(${-textTrans}px)`
    headerRight.style.transform = `translateX(${textTrans}px)`
}

// Projects
const projectsSticky = document.querySelector('.projects__sticky')
const projectSlider = document.querySelector('.projects__slider')

let projectTargetX = 0
let projectCurrentX = 0

let percentages = { // 디바이스 크기에 따라 슬라이드 이미지 크기를 다르게 설정하기 위함
    small: 700,
    medium: 300,
    large: 100
}

let limit = window.innerWidth <= 600 ? percentages.small :
            window.innerWidth <= 1100 ? percentages.medium: 
            percentages.large

function setLimit(){
    let limit = window.innerWidth <= 600 ? percentages.small :
            window.innerWidth <= 1100 ? percentages.medium: 
            percentages.large 
}

window.addEventListener('resize', setLimit) // 디바이스 크기를 변경할때마다 슬라이드 이미지 사이즈를 다르게 설정

// 스크롤을 내릴수록 main.scrollTop 값은 점점 커지며, main.scrollTop 값과 offsetTop 값이 같아진다는 의미는 project 섹션이 브라우저 상단에 닿았다는 의미다
// percentage 의미 : 브라우저 상단과 projects 섹션간의 거리가 브라우저 높이 대비 몇 % 인지. 그리고 양수 음수에 따라 브라우저 상단보다 projects 섹션이 아래에 있는지 위에 있는지 알려준다
// 예를 들어 percentage 가 -200% 이면 projects 섹션은 브라우저 상단보다 브라우저 높이의 두배만틈 아래에 위치한다. 
// percentage 가 -50% 이면 projects 섹션은 브라우저 상단보다 브라우저 높이의 50%만큼 아래에 위치한다. 즉, projects 섹션은 브라우저 화면의 수직중앙에 위치한다.
// projects 섹션은 브라우저 상단에 닿는순간부터 스크롤을 내리면 percentage 가 양수값으로 점점 커진다. 그 의미는 섹션이 닿는순간부터 해당 섹션을 왼쪽으로 이동한다는 의미다.
// 결국 정리하면 브라우저 높이대비 projects 섹션과 브라우저 상단간 거리의 % 를 가로방향으로 몇 % 움직일지로 전환한 것이다.
// 예를 들어 projectCurrentX 값이 100 이면 슬라이드는 왼쪽으로 -100vw 만큼 이동한다. 이는 슬라이드 이미지 4장 정도가 움직이는 거리다.
// 현재 슬라이더 높이가 200% (브라우저 높이의 두배)이므로 스크롤을 브라우저 하단까지 완전히 내리는동안 슬라이더는 8장 정도 움직인다.
// 하지만 슬라이더 높이 200%는 현재 보여지는 슬라이드 이미지 4장을 포함한 높이이므로 실제 projects 섹션이 브라우저 상단에 닿고부터는 100%만큼만 이동이 가능하다.
// 결국 projects 섹션이 브라우저 상단에 닿고나서 스크롤 내린만큼 슬라이더를 왼쪽으로 이동시킨다.
function animateProjects(){
    let offsetTop = projectsSticky.parentElement.offsetTop  // main 요소(부모 요소)와 projects section 요소와의 거리
    // console.log(offsetTop) // 고정값
    // console.log(main.scrollTop) // 0에서부터 스크롤 내릴수록 점점 커지는 양수값
    let percentage = (main.scrollTop - offsetTop)
    // console.log(percentage) // 스크롤 내릴수록 음수값에서 0을 거쳐 양수값으로 점점 커짐
    percentage = (main.scrollTop - offsetTop) / window.innerHeight * 100
    percentage = percentage < 0 ? 0 : percentage > limit ? limit : percentage // percentage 값이 음수이면 projects 섹션이 브라우저 상단에 닿지 않은 경우이므로 이때는 percentage 값을 0으로 고정하여 projects 섹션이 브라우저 상단에 닿기 전에는 슬라이드 이미지가 움직이지 않도록 고정함
    // limit 은 현재 100이다. 모바일 디바이스에서는 현재보다 큰 limit 을 적용한다. 왜냐하면 컨텐츠 길이를 800%로 설정하였기 때문이다. 즉 -700vw (슬라이드 사진이 7장 움직인다.)
    projectTargetX = percentage
    // console.log(percentage)
    projectCurrentX = lerp(projectCurrentX, projectTargetX, .1)
    projectSlider.style.transform = `translate3d(${-projectCurrentX}vw, 0, 0)`
}


// Post animation
const blogSection = document.getElementById('blog')
const blogPosts = document.querySelectorAll('.post')

// offset : 예를 들어 i 값이 0이면 블로그 섹션(blogSectionTop === -window.innerHeight) 이 브라우저 높이만큼 위로 올라가면 offset 은 0이다. 이때 첫번째 블로그가 브라우저 상단에 닿아있는 시점이다. 
// 거기서 블로그 섹션이 브라우저 높이의 절반만큼 더 올라가면 (blogSectionTop === -1.5 * window.innerHeight)이며, offset 은 -0.5 * window.innerHeight 이 된다. 즉, 첫번째 블로그가 브라우저 높이의 절반만큼 브라우저 상단보다 올라간 상태를 의미한다.
// offset 값은 0 에서 시작해서 음수값으로 점점 커진다.
function scrollBlogPosts(){
    let blogSectionTop = blogSection.getBoundingClientRect().top 
    // console.log(blogPosts.length) // 브라우저 상단과 블로그 섹션 간의 거리 (양수 -> 0 -> 음수)

    for (let i = 0; i < blogPosts.length; i++) {
        if(blogPosts[i].parentElement.getBoundingClientRect().top <= 1){
            let offset = (blogSectionTop + window.innerHeight * (i + 1)) * 0.0005 // 해당 블로그(상단)가 브라우저 상단보다 얼마만큼 위로 올라갔는지에 대한 거리차 * 0.0005
            // console.log(offset)
            offset = offset < -1 ? -1 : offset >= 0 ? 0 : offset // 0 ~ -1 사이 값으로 제한
            blogPosts[i].style.transform = `scale(${1+ offset})` // 1 + offset : 1 ~ 0 으로 변화

        }
        
    }
}

// Circle animation
const circleSection = document.getElementById('circle__section')
const circle = document.querySelector('.circle')

function scrollCircle(){
    let {top} = circleSection.getBoundingClientRect()
    let scaleTop = Math.abs(top)
    let scale = (scaleTop / window.innerHeight) // 브라우저 높이 대비 circle 섹션이 브라우저 상단보다 얼마나 올라갔는가? 두배 이상 올라가면 2
    // 하지만 현재는 circle 섹션이 브라우저 높이의 두배이고, circle 영역이 브라우저 높이만큼 차지하므로 실제 스크롤 가능한 길이는 브라우저 높이만큼이다. 그래서 scale 최댁값은 1 최소값은 0
    scale = scale > 1 ? 1 : scale < 0 ? 0 : scale // scale 값을 1 ~ 0 범위로 제한

    if(top <= 0){ // circle 섹션이 브라우저 상단에 닿은 이후 브라우저 상단보다 높이 올라가는 경우
        circle.style.transform = `translate(-50%, -50%) scale(${scale})`
    }else{ // circle 섹션이 브라우저 상단보다 아래에 위치한 경우
        circle.style.transform = `translate(-50%, -50%) scale(0)` // 브라우저 상단에 닿기전까지는 원을 보이지 않음
    }
}

// discover text animation
const dContainer = document.querySelector('.discover__container')
const leftText = document.querySelector('.text__left')
const rightText = document.querySelector('.text__right')

function scrollDiscover(){
    let {bottom} = dContainer.getBoundingClientRect()
    let textTrans = bottom - window.innerHeight // bottom 은 브라우저 상단과 dContainer 하단간의 거리이므로 textTran 는 브라우저 상단과 dContainer 상단간의 거리
    textTrans = textTrans < 0 ? 0 : textTrans // 제한하지 않으면 텍스트가 교차되면서 다시 사라진다
    leftText.style.transform = `translateX(${-textTrans}px)`
    rightText.style.transform = `translateX(${textTrans}px)`
}

// Text reveal
const textReveals = document.querySelectorAll('.text__reveal')

let callback = (entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            console.log(entry.target)
            entry.target.querySelectorAll('span').forEach((span, idx) => {
                setTimeout(() => {
                    span.style.transform = `translateY(0)`
                }, (idx + 1) * 50)
            })
        }
    })
}
let options = {
    rootMargin: '0px',
    threshold: 1.0
}
let observer = new IntersectionObserver(callback, options)
textReveals.forEach(text => {
    let string = text.innerText 
    console.log(text)
    let html = ''
    for (let i = 0; i < string.length; i++) {
        html += `<span>${string[i]}</span>`
    }
    text.innerHTML = html
    observer.observe(text.parentElement) // parentElement 가 브라우저 높이와 동일하므로 parentElement 가 브라우저에 나타나면 애니메이션이 시작된다
})


function animate(){
    animateProjects()
    scrollBlogPosts()
    scrollCircle()
    scrollDiscover()
    requestAnimationFrame(animate)
}

animate()



