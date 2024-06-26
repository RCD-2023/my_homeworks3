const server = {
  async getPosts() {
    return fetch("http://localhost:3000/posts").then((response) => {
      if (response.ok) return response.json();

      return [];
    });
  },
  async getPostById(id) {
    return fetch(`http://localhost:3000/posts/${id}`).then((response) => {
      if (response.ok) return response.json();

      return null;
    });
  },
  async getUserById(id) {
    return fetch(`http://localhost:3000/users/${id}`).then((response) => {
      if (response.ok) return response.json();

      return null;
    });
  },
  async addNewPost(payload) {
    return fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());
  },
  async removePost(id) {
    return fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    }).then((response) => response.ok);
  },
  async updatePost(id, payload) {
    return fetch(`http://localhost:3000/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());
  },
  // TODO: de implementat o metoda de GET pe user dupa id
};
