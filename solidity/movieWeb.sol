pragma solidity ^0.4.24;


interface token {
    function transfer(address receiver, uint amount) external returns (bool);
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
    function balanceOf(address user) external returns (uint);
    function mintToken(address target, uint256 mintedAmount) external;
}

contract movieWeb {

    // =========================================================================
    // ============================ VARIABLES ==================================
    // =========================================================================
    uint constant MAX_CAST_NUM = 5;
    address public OWNER;
    token public tokenUsed;

    struct movie {
        string releaseDate;
        // Server can calculate the rating = ratingSum / raterSum
        uint ratingSum;
        uint raterSum;
        string genre;
        string desc;
        string country;
        string casts;
        uint moviePrice;
        mapping (address => review) reviews;
        address[] reviewer;

        bool isValue;
    }

    struct review {
        string comment;
        uint rating;

        bool isValue;
    }

    mapping (address => string) users;
    mapping (address => string) producers;
    address[] userKeys;
    address[] producerKeys;
    mapping (address => mapping (string => movie)) moviesProduced;
    mapping (address => mapping (address => mapping (string => uint))) moviesWatched;

    uint public tokenPerEther_buyPrice;
    uint public tokenPerEther_sellPrice;
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // =========================== CONSTRUCTOR =================================
    // =========================================================================
    constructor(address _tokenUsed, uint _buyPrice, uint _sellPrice) public {
        OWNER = msg.sender;
        tokenUsed = token(_tokenUsed);
        tokenPerEther_buyPrice = _buyPrice;
        tokenPerEther_sellPrice = _sellPrice;
    }
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // ============================ EVENTS =====================================
    // =========================================================================
    event WriteReview(bool success, string desc);
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // ======================== GETTER FUNCTION ================================
    // =========================================================================
    function getUserName(address user) public constant returns (string){
        return users[user];
    }

    function getProducerName(address producer) public constant returns (string){
        return producers[producer];
    }

    function getMovie(address producer, string name) internal constant returns (movie){
        return moviesProduced[producer][name];
    }

    function getMovieReleaseDate(address producer, string name) public constant returns (string){
        return getMovie(producer, name).releaseDate;
    }

    function getMovieRatingSum(address producer, string name) public constant returns (uint){
        return getMovie(producer, name).ratingSum;
    }

    function getMovieRaterSum(address producer, string name) public constant returns (uint){
        return getMovie(producer, name).raterSum;
    }

    function getMovieGenre(address producer, string name) public constant returns (string){
        return getMovie(producer, name).genre;
    }

    function getMovieDesc(address producer, string name) public constant returns (string){
        return getMovie(producer, name).desc;
    }

    function getMovieCountry(address producer, string name) public constant returns (string){
        return getMovie(producer, name).country;
    }

    function getMoviePrice(address producer, string name) public constant returns (uint){
        return getMovie(producer, name).moviePrice;
    }

    function getMovieCasts(address producer, string name) public constant returns (string){
        return getMovie(producer, name).casts;
    }

    function hasPaid(address producer, address user, string movieName) public constant returns (uint){
        return moviesWatched[user][producer][movieName];
    }

    function getMovieReviewCount(address producer, string movieName) public constant returns (uint){
        return getMovie(producer, movieName).reviewer.length;
    }

    function getMovieReviewCommentAtIndex(address producer, string movieName, uint index) public constant returns (string){
        address currReviewer = getMovie(producer, movieName).reviewer[index];
        return moviesProduced[producer][movieName].reviews[currReviewer].comment;
    }

    function getMovieReviewRatingAtIndex(address producer, string movieName, uint index) public constant returns (uint){
        address currReviewer = getMovie(producer, movieName).reviewer[index];
        return moviesProduced[producer][movieName].reviews[currReviewer].rating;
    }

    function getMovieReviewReviewerNameAtIndex(address producer, string movieName, uint index) public constant returns (string){
        address currReviewer = getMovie(producer, movieName).reviewer[index];
        return users[currReviewer];
    }

    function hasReviewed(address producer, address _user, string movieName) public constant returns (bool){
        return moviesProduced[producer][movieName].reviews[_user].isValue;
    }
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // =========================== MODIFIER ====================================
    // =========================================================================
    modifier onlyOwner() {
        require(msg.sender == OWNER);
        _;
    }
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // ======================== SETTER FUNCTION ================================
    // =========================================================================
    function addUser(address user, string name) public onlyOwner {
        users[user] = name;
        userKeys.push(user);
    }

    function addProducer(address producer, string name) public onlyOwner {
        producers[producer] = name;
        producerKeys.push(producer);
    }

    function addMovie(
        address producer,
        string movieName,
        string releaseDate,
        string genre,
        string casts,
        string desc,
        string country,
        uint moviePrice
    ) public {
        // Has to be the owner
        require(msg.sender == OWNER);

        moviesProduced[producer][movieName].releaseDate = releaseDate;
        moviesProduced[producer][movieName].raterSum = 0;
        moviesProduced[producer][movieName].ratingSum = 0;
        moviesProduced[producer][movieName].genre = genre;
        moviesProduced[producer][movieName].casts = casts;
        moviesProduced[producer][movieName].desc = desc;
        moviesProduced[producer][movieName].country = country;
        moviesProduced[producer][movieName].moviePrice = moviePrice;
        moviesProduced[producer][movieName].isValue = true;
    }

    function writeReview(
        address producer,
        string movieName,
        string comment,
        uint rate
    ) public {
        // Producers cannot make review
        require(bytes(producers[msg.sender]).length == 0);

        require(rate <= 10);

        // Check overflow
        require(moviesProduced[producer][movieName].raterSum + 1 > moviesProduced[producer][movieName].raterSum);
        require(moviesProduced[producer][movieName].ratingSum + rate >= moviesProduced[producer][movieName].ratingSum);

        if(moviesWatched[msg.sender][producer][movieName] > 0){
            if(!moviesProduced[producer][movieName].reviews[msg.sender].isValue){
                moviesProduced[producer][movieName].reviews[msg.sender].comment = comment;
                moviesProduced[producer][movieName].reviews[msg.sender].rating = rate;
                moviesProduced[producer][movieName].reviews[msg.sender].isValue = true;
                moviesProduced[producer][movieName].raterSum += 1;
                moviesProduced[producer][movieName].ratingSum += rate;
                moviesProduced[producer][movieName].reviewer.push(msg.sender);
                emit WriteReview(true, "Successfully write a review");
                // Check review and send ether
                // if(good review){
                //     msg.sender.transfer(5);
                // }
                if(bytes(comment).length >= 200){
                    if(tokenUsed.balanceOf(this) < 1){
                        tokenUsed.mintToken(this, 1);
                    }
                    require(tokenUsed.transfer(msg.sender, 1));
                }
            } else {
                emit WriteReview(false, "You can only make 1 review per movie");
            }
        } else {
            emit WriteReview(false, "You can only make a review if you have watched this movie");
        }
    }

    function watchMovie(address _from, address producer, string movieName) public returns (bool){
        require(bytes(users[_from]).length != 0);
        require(tokenUsed.transferFrom(_from, this, moviesProduced[producer][movieName].moviePrice));
        moviesWatched[_from][producer][movieName] += 1;
        tokenUsed.transfer(producer, moviesProduced[producer][movieName].moviePrice - 1);
        return true;
    }

    function setBuyPrice(uint tokenPerEther) public onlyOwner {
        tokenPerEther_buyPrice = tokenPerEther;
    }

    function setSellPrice(uint tokenPerEther) public onlyOwner {
        tokenPerEther_sellPrice = tokenPerEther;
    }
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // ======================== BUY/SELL FUNCTION ==============================
    // =========================================================================
    function buyToken(uint amount) public payable returns (bool) {
        require(tokenUsed.balanceOf(this) >= amount);
        require(msg.value >= amount * 1 ether / tokenPerEther_buyPrice);
        msg.sender.transfer(msg.value - (amount * 1 ether / tokenPerEther_buyPrice));
        require(tokenUsed.transfer(msg.sender, amount));
        return true;
    }

    function sellToken(address _from, uint amount) public returns (bool) {
        require(address(this).balance >= amount * 1 ether / tokenPerEther_sellPrice);
        require(tokenUsed.transferFrom(_from, this, amount));
        _from.transfer(amount * 1 ether / tokenPerEther_sellPrice);
        return true;
    }
    // =========================================================================
    // =========================================================================



    // =========================================================================
    // ======================== DELETION FUNCTION ==============================
    // =========================================================================
    function deleteReview(address producer, string movieName, address reviewer) public onlyOwner {
        delete moviesProduced[producer][movieName].reviews[reviewer];
    }

    // Expensive function
    function deleteMovie(address producer, string movieName) public onlyOwner {
        uint totalReviewer = moviesProduced[producer][movieName].reviewer.length;
        for(uint i=0; i<totalReviewer; i++){
            address currReviewer = moviesProduced[producer][movieName].reviewer[i];
            delete moviesProduced[producer][movieName].reviews[currReviewer];
        }
        delete moviesProduced[producer][movieName];
        for(uint j=0; j<userKeys.length; j++){
            moviesWatched[userKeys[j]][producer][movieName] = 0;
        }
    }

    function deleteProducer(address producer) public onlyOwner {
        delete producers[producer];
        for(uint i=0; i<producerKeys.length; i++){
            if(producerKeys[i] == producer){
                delete producerKeys[i];
                break;
            }
        }
    }

    function deleteUser(address user) public onlyOwner {
        delete users[user];
        for(uint i=0; i<userKeys.length; i++){
            if(userKeys[i] == user){
                delete userKeys[i];
                break;
            }
        }
    }


    function kill() public onlyOwner {
        tokenUsed.transfer(OWNER, tokenUsed.balanceOf(address(this)));
        selfdestruct(OWNER);
    }
    // =========================================================================
    // =========================================================================


    // Fallback function
    function () public payable {
    }
}
