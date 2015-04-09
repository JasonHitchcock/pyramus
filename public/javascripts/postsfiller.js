var subpy = $('#subpy').text();

// ajax calls every X milliseconds
var pollInterval = 4000;

var App = React.createClass({
    getInitialState: function() {
        return {
            posts: []
        };
    },
    // handleDownvote
    handleUpvote: function(postId) {
        $.ajax({
            type: 'POST',
            url: '/posts/upvote/' + postId,
            success: function() {
                var currPosts = this.state.posts;
                for (var i = 0, len = currPosts.length; i < len; i++) {
                    if (currPosts[i].id === postId) {
                        currPosts[i].user_id = 1;
                    }
                }
                console.log(currPosts);
                this.setState({posts: currPosts});
            }.bind(this)
        });
    },
    loadPostsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({posts: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadPostsFromServer();
        setInterval(this.loadPostsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="posts-app">
                <PostsList handleUpvote={this.handleUpvote} posts={this.state.posts}/>
            </div>
        );
    }
});

var PostsList = React.createClass({
    render: function() {
        var handleUpvote = this.props.handleUpvote;
        var posts = this.props.posts.map(function(post) {
            return (
                <Post handleUpvote={handleUpvote} post={post} />
            );
        });

        return (
            <ul className="postsList">
                {posts}
            </ul>
        );
    }
});

var Post = React.createClass({
    render: function() {
        var post = this.props.post;

        return (
            <li className="post row">
                <UpvoteButton handleUpvote={this.props.handleUpvote}postId={post.id} upvoted={post.user_id}/>
                <PostTitle post={post} />
                <PostInfoBanner score={post.score} age={post.age} author={post.author} />
            </li>
        );
    }
});

var PostTitle = React.createClass({
    render: function() {
        var post = this.props.post;

        // TODO: Handle case where no self text but is not link
        if (post.selfText) {
            return (
                <span className="post-title">{post.title}</span>
            );
        } else {
            return (
                <a href={post.url} className="post-title">{post.title}</a>
            );
        }
    }
});

var PostInfoBanner = React.createClass({
    render: function() {
        var bannerAge = '';
        var age = this.props.age;

        // Format the age accordingly
        if (age.days) {
            bannerAge = age.days;

            if (age.days === 1) {
                bannerAge += ' day ';
            } else {
                bannerAge += ' days ';
            }
        }
        else if (age.hours) {
            bannerAge = age.hours;

            if (age.hours === 1) {
                bannerAge += ' hour ';
            } else {
                bannerAge += ' hours ';
            }
        }
        else if (age.minutes) {
            bannerAge = age.minutes;

            if (age.minutes === 1) {
                bannerAge += ' minute ';
            } else {
                bannerAge += ' minutes ';
            }
        } else {
            bannerAge = age.seconds;

            if (age.seconds === 1) {
                bannerAge += ' second ';
            } else {
                bannerAge += ' seconds ';
            }
        }

        return (
            <div className="post-info-banner">
                <p>{this.props.score} points | Submitted {bannerAge} ago by {this.props.author}</p>
            </div>
        );
    }
});

var UpvoteButton = React.createClass({
    getImage: function() {
        if (this.props.upvoted) {
            return "/images/upvoted.svg"
        } else {
            return "/images/upvote.svg"
        }
    },
    render: function() {
        var imageSrc = this.getImage();
        return <img src={imageSrc} onClick={this.props.handleUpvote.bind(null, this.props.postId)} className="upvote-button" />
    }
});

React.render(
    <App url={'/posts/' + subpy} pollInterval={pollInterval}/>,
    document.getElementById("react-posts-app-mount")
);
