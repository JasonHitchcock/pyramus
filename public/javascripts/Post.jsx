/** @jsx React.DOM */

// TODO: Implement comment counting in backend

var Post = React.createClass({
    propTypes: {
        handleUpvote: React.PropTypes.func.isRequired,
        handleRemoveUpvote: React.PropTypes.func.isRequired,
        post: React.PropTypes.shape({
            id: React.PropTypes.number,
            author: React.PropTypes.string,
            title: React.PropTypes.string,
            url: React.PropTypes.string,
            self_text: React.PropTypes.string,
            score: React.PropTypes.number,
            subpy: React.PropTypes.string,
            upvoted: React.PropTypes.bool,
            age: React.PropTypes.object
        }),
        upvoteImageURL: React.PropTypes.string.isRequired,
        upvotedImageURL: React.PropTypes.string.isRequired,
        commentsURL: React.PropTypes.string.isRequired
    },
    render: function() {
        var post = this.props.post;

        return (
            <li className="post">
                <UpvoteButton
                    handleUpvote={this.props.handleUpvote}
                    handleRemoveUpvote={this.props.handleRemoveUpvote}
                    postId={post.id}
                    upvoted={post.upvoted}
                    upvoteImageURL={this.props.upvoteImageURL}
                    upvotedImageURL={this.props.upvotedImageURL}
                />
                <PostTitle post={post} />
                <PostInfoBanner
                    score={post.score}
                    age={post.age}
                    author={post.author}
                    upvoted={post.upvoted}
                    commentsURL={this.props.commentsURL}
                />
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
    getPostPointsClassname: function() {
        var ret = 'post-points ';

        if (this.props.upvoted) {
            ret += 'post-points-upvoted'
        } else {
            ret += 'post-points-not-upvoted'
        }

        return ret;
    },
    getFormattedPointsText: function() {
        if (this.props.score === 1) {
            return 'point';
        } else {
            return 'points';
        }
    },
    render: function() {
        var bannerAge = getAgeString(this.props.age);
        var postPointsClassname = this.getPostPointsClassname();
        var formattedPointsText = this.getFormattedPointsText();
        var authorURL = '/u/' + this.props.author;

        return (
            <div className="post-info-banner">
                <p>
                <span className={postPointsClassname}>{this.props.score}</span> {formattedPointsText} | Submitted by <a href={authorURL} className="post-author">{this.props.author}</a> <span className="post-age">{bannerAge}</span> ago | <a href={this.props.commentsURL}>comments</a>
                </p>
            </div>
        );
    }
});

var UpvoteButton = React.createClass({
    getImage: function() {
        if (this.props.upvoted) {
            return this.props.upvotedImageURL;
        } else {
            return this.props.upvoteImageURL;
        }
    },
    render: function() {
        var imageSrc = this.getImage();
        var upvoteFunction;

        if (this.props.upvoted) {
            upvoteFunction = this.props.handleRemoveUpvote;
        } else {
            upvoteFunction = this.props.handleUpvote;
        }

        return <img className="upvote-button" src={imageSrc} onClick={upvoteFunction.bind(null, this.props.postId)} className="upvote-button" />
    }
});
