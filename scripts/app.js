const CURRENT_USER_ID = 1;

const ui = {
  postsContainerEl: document.querySelector("#posts"),
  openNewPostFormEl: document.querySelector("#open-new-post-form"),
  newPostFormEl: document.querySelector("#new-post-form"),
  submitFormButtonEl: document.querySelector("#submit"),
};

(function init() {
  server.getPosts().then(renderPosts);
  initEventListeners();
})();

function renderPosts(posts) {
  posts.forEach(renderPost);
}

function renderPost(post) {
  const htmlContent = `<div class="post">
    <span class="show-more" onclick="onShowMore(event,${post.id})">🔎</span>
      <h3>${post.title}</h3>
    <div class="show-details"> 
    <div>User Id: ${post.userId}</div>
    <div>Continut: ${post.content}</div>
    </div>
      <p class="likes">${post.likes} likes</p>
      <p class="dislikes">${post.dislikes} dislikes</p>
      
      <div style="user-select: none">
        ${
          post.userId != CURRENT_USER_ID
            ? `<span class="like" onclick="onLike(event, ${post.id})">👍</span>
          <span class="dislike" onclick="onDislike(event, ${post.id})">👎</span>`
            : `<span class="remove" onclick="onRemovePost(event, ${post.id})">✖️</span>  
          <span class="edit" onclick="onEditPost(event, ${post.id})">✒️</span>`
        }
      </div>
    
    </div>`;

  ui.postsContainerEl.insertAdjacentHTML("beforeend", htmlContent);
}

function initEventListeners() {
  ui.openNewPostFormEl.addEventListener("click", () => {
    ui.newPostFormEl.style.display = "block";
    ui.openNewPostFormEl.style.display = "none";
    ui.submitFormButtonEl.textContent = "Add post";
  });

  ui.newPostFormEl.addEventListener("submit", (event) => {
    if (event.target.method.toUpperCase() === "POST") {
      // s-a verificat metoda formularului daca este post
      const newPost = {
        userId: CURRENT_USER_ID,
        title: ui.newPostFormEl.title.value,
        content: ui.newPostFormEl.content.value,
        likes: 0,
      };

      server.addNewPost(newPost).then(renderPost); //functia asincrona addNewPost
    } else {
      // inseamna ca este PATCH - singura cealalta optiune pusa de noi din cod
      const updatePayload = {
        title: ui.newPostFormEl.title.value,
        content: ui.newPostFormEl.content.value,
      };

      server.updatePost(event.target.dataset.id, updatePayload).then(() => {
        //functia asincrona updatePost
        // TODO: de actualizat UI-ul ?? ⁉ nu am inteles ce trebuie sa fac aici
      });
    }

    ui.newPostFormEl.style.display = "none";
    ui.newPostFormEl.title.value = "";
    ui.newPostFormEl.content.value = "";
    ui.openNewPostFormEl.style.display = "inline";

    event.preventDefault();
  });
}

function onRemovePost(event, id) {
  server.removePost(id).then((removedState) => {
    if (removedState) {
      event.target.closest(".post").remove();
    }
  });
}

function onLike(event, id) {
  server.getPostById(id).then((post) => {
    server
      .updatePost(id, {
        likes: ++post.likes,
      })
      .then((updatedPost) => {
        if (updatedPost) {
          event.target
            .closest(".post")
            .querySelector(".likes").textContent = `${updatedPost.likes} likes`;
        }
      });
  });
}

// TODO: de implementat dislike
function onDislike(event, id) {
  server.getPostById(id).then((post) => {
    server
      .updatePost(id, {
        dislikes: ++post.dislikes,
      })
      .then((updatedPost) => {
        if (updatedPost) {
          event.target
            .closest(".post")
            .querySelector(
              ".dislikes"
            ).textContent = `${updatedPost.dislikes} dislikes`;
        }
      });
  });
}

function onEditPost(event, id) {
  server.getPostById(id).then((post) => {
    ui.openNewPostFormEl.style.display = "none";
    ui.newPostFormEl.method = "PATCH";
    ui.newPostFormEl.title.value = post.title;
    ui.newPostFormEl.content.value = post.content;
    ui.newPostFormEl.dataset.id = post.id;
    ui.submitFormButtonEl.textContent = "Update post";
    ui.newPostFormEl.style.display = "block";
  });
}

// TODO: la click pe lupa sa vedem imediat sub titlu: utilizatorul si continutul post-ului
function onShowMore(event, id) {
  const postElement = event.target.closest(".post");
  if (postElement) {
    //nested if
    const showDetailsEl = postElement.querySelector(".show-details");
    if (showDetailsEl) {
      showDetailsEl.style.display = "block";
      console.log("Elementul a fost făcut vizibil:", showDetailsEl);
    } else {
      console.error("Nu s-a găsit element cu clasa .show-details");
    }
  } else {
    console.error("Nu s-a găsit element părinte cu clasa .post");
  }
}
