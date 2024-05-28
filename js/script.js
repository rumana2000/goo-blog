let toggle = document.querySelector(".toggle");
let slide = document.querySelector(".slide")
toggle.onclick = function () {
    toggle.classList.toggle('active')
    slide.classList.toggle('active')

}

const BASE_URL = "https://dummyjson.com"
let postCard = document.querySelector(".postCard")
let pagination = document.querySelector(".showPagination")
let posts = []
let totalUser = 0
let allUser = []
let PER_PAGE = 20
let currentPage = 1
let totalPost = 0
let dealy = false


document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem('auth_key')
    if (!token || token == 'null') {
        window.location.href = 'login.html'
    }
    
});
function logOut() {
    localStorage.setItem('auth_key', 'null')
    window.location.href = 'login.html'
}

async function loadAllUsers() {
    const response = await fetch(`${BASE_URL}/users?limit=100`)
    const user = await response.json()
    return user;
}
document.addEventListener("DOMContentLoaded", async () => {
    try {
        user = await loadAllUsers()

    } catch (err) {
        console.log("error!");
        console.log(e);
    }
    let singleUser = user.users
    singleUser.forEach(function (element) {
        allUser[element.id] = element

    })
    showAllPostCard(`${BASE_URL}/posts?skip=0&limit=${PER_PAGE}`);

})
function search() {
    let searchInput = document.querySelector(".input-item").value
    let url = ""
    if (searchInput.length >= 3) {
        url = `https://dummyjson.com/posts/search?q=${searchInput}`
    } else if (searchInput.length == 0) {
        url = "https://dummyjson.com/posts"
    }
    if (dealy) {
        clearTimeout(dealy)
    }
    dealy = setTimeout(function () {
        showAllPostCard(url)
    }, 1000)

}


function showAllPostCard(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            totalPost = data.total;
            let allPost = data.posts;
            let allPostCard = ""
            console.log(allPost, "hi");
            if (allPost.length == false) {
                allPostCard += `<div class="header-section mt-5">
                <h2>Not Founded</h2>
                <button type="button" class="btn btn-danger" data-index="${allPost}" onclick="loadallposts(this)" >Go-Back</button>
            </div>`
            } else {
                allPost.forEach(function (post) {
                    console.log(post, "hlw");
                    let postBody = post.body
                    let result = ''
                    if (postBody.length > 200) {
                        let concatePostbody = postBody.substring(0, 200)
                        let text = "......"
                        result = concatePostbody.concat(text)
                    } else {
                        result = postBody
                    }
                    allPostCard += `
                    <div class="col-md-4 mt-2">
                    <div class="card">
                        <div class="card-content p-3 mb-1">
                            <div class="post-content-preview">
                                <h4 class="mt-1 style=" font-weight: bold;">${post.title}</h4>
                                <p class="mt-1">${post.body}</p>
                            </div>
                            <a class="btn btn-outline-danger text-center" data-toggle="modal"
                                data-target="#exampleModal" data-index="${post.id}" onclick="loadsingleposts(this)"><i
                                    class="bi bi-eye"></i>View</a>

                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <div class="card-reaction-section">
                                <i class="bi bi-heart-fill"></i> <span>${post.reactions.likes}</span>
                            </div>
                        </div>

                    </div>
                </div> `
                });
            }
            postCard.innerHTML = allPostCard
            console.log(allPostCard);
            showAllPostPagination()

        });
}

function loadsingleposts(e) {
    document.getElementById("exampleModalLabel").innerHTML = ''
    document.querySelector(".modal-body").innerHTML = ''
    let id = e.getAttribute("data-index")
    fetch(`${BASE_URL}/posts/${id}`)
        .then((response) => response.json())
        .then((data) => {
            let singelPosts = data;
            document.getElementById("exampleModalLabel").innerHTML = `${singelPosts.title}`
            document.querySelector(".modal-body").innerHTML = `${singelPosts.body}`
        })

}

function loadallposts(e) {
    let allLodePosts = e.getAttribute("data-index")
    showAllPostCard(`${BASE_URL}/posts?skip=0&limit=${PER_PAGE}`)
}

function showAllPostPagination() {
    let numberOfPagination = Math.ceil(totalPost / PER_PAGE);
    let activePage = ""
    for (let i = 1; i <= numberOfPagination; i++) {
        if (currentPage == i) {
            activePage += `<li class="link"><button class="active" type="button" data-index="${i}" onclick="loadPagination(this)">${i}</button></li>`
        } else {
            activePage += `<li class="link"><button type="button" data-index="${i}" onclick="loadPagination(this)">${i}</button></li>`
        }
    }
    pagination.innerHTML = activePage;
}

function loadPagination(e) {
    let paginationIndex = e.getAttribute("data-index")
    currentPage = paginationIndex
    skip = PER_PAGE * (paginationIndex - 1)
    url = `${BASE_URL}/posts?skip=${skip}&limit=${PER_PAGE}`;
    showAllPostCard(url)
}

showAllPostPagination()