pragma solidity ^0.4.0;


contract movieWeb {
    
    // =========================================================================
    // ============================ VARIABLES ==================================
    // =========================================================================
    uint constant MAX_CAST_NUM = 5;
    address public OWNER;

    struct movie {
        string releaseDate;
        // Server can calculate the rating = ratingSum / raterSum
        uint ratingSum;
        uint raterSum;
        string genre;
        string desc;
        string country;
        address producer;
        string[] casts;
        uint moviePrice;
        mapping (address => string) reviews;
    }
    
    mapping (address => string) users;
    mapping (address => string) producers;
    mapping (address => mapping (string => movie)) moviesProduced;
    mapping (address => mapping (address => mapping (string => uint))) moviesWatched;
    // =========================================================================
    // =========================================================================
    
    
    // =========================================================================
    // =========================== CONSTRUCTOR =================================
    // =========================================================================
    constructor() public {
        OWNER = msg.sender;
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
    
    function getMovieProducer(address producer, string name) public constant returns (string){
        return producers[getMovie(producer, name).producer];
    }
    
    function getMoviePrice(address producer, string name) public constant returns (uint){
        return getMovie(producer, name).moviePrice;
    }
    // =========================================================================
    // =========================================================================
    
    
    // =========================================================================
    // =========================== MODIFIER ====================================
    // =========================================================================
    modifier onlyOwner() {
        if(msg.sender != OWNER) throw;
        _;
    }
    // =========================================================================
    // =========================================================================
    
    
    // =========================================================================
    // ======================== SETTER FUNCTION ================================
    // =========================================================================
    function addUser(address user, string name) public {
        users[user] = name;
    }
    
    function addProducer(address producer, string name) public onlyOwner {
        producers[producer] = name;
    }
    
    function addMovie(
        address producer,
        string movieName,
        string releaseDate, 
        string genre,
        string desc,
        string country,
        uint priceInEther
    ) public {
        // Has to be a producer
        require(bytes(producers[msg.sender]).length != 0);
        
        moviesProduced[producer][movieName].releaseDate = releaseDate;
        moviesProduced[producer][movieName].producer = producer;
        moviesProduced[producer][movieName].raterSum = 0;
        moviesProduced[producer][movieName].ratingSum = 0;
        moviesProduced[producer][movieName].genre = genre;
        moviesProduced[producer][movieName].desc = desc;
        moviesProduced[producer][movieName].country = country;
        moviesProduced[producer][movieName].moviePrice = priceInEther * 1 ether;
    }
    
    function addCast(address producer, string movieName, string castName) public returns (bool){
        // Has to be a producer
        require(bytes(producers[msg.sender]).length != 0);
        
        if(moviesProduced[producer][movieName].casts.length < MAX_CAST_NUM){
            moviesProduced[producer][movieName].casts.push(castName);
            return true;
        }
        return false;
    }
    
    function rateMovie(address producer, string movieName, uint rate) public returns (bool){
        if(rate > 10) return false;

        // Check overflow
        require(moviesProduced[producer][movieName].raterSum + 1 > moviesProduced[producer][movieName].raterSum);
        require(moviesProduced[producer][movieName].ratingSum + rate >= moviesProduced[producer][movieName].ratingSum);
        
        moviesProduced[producer][movieName].raterSum += 1;
        moviesProduced[producer][movieName].ratingSum += rate;
        return true;
    }
    
    function writeReview(
        address producer,
        string movieName,
        string review
    ) public {
        if(moviesWatched[msg.sender][producer][movieName] > 0){
            if(bytes(moviesProduced[producer][movieName].reviews[msg.sender]).length == 0){
                moviesProduced[producer][movieName].reviews[msg.sender] = review;
                emit WriteReview(true, "Successfully write a review");
                // Check review and send ether
                // if(good review){
                //     msg.sender.transfer(5);
                // }
            } else {
                emit WriteReview(false, "You can only make 1 review per movie");
            }
        } else {
            emit WriteReview(false, "You can only make a review if you have watched this movie");
        }
    }
    
    function watchMovie(address producer, string movieName) public payable returns (bool){
        if(moviesWatched[msg.sender][producer][movieName] == 0){
            require(msg.value == getMoviePrice(producer, movieName));
            moviesWatched[msg.sender][producer][movieName] += 1;
            return true;
        } else {
            moviesWatched[msg.sender][producer][movieName] += 1;
            return true;
        }
        return false;
    }
    // =========================================================================
    // =========================================================================
}
