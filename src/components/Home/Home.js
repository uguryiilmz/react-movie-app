import React, {Component} from 'react'
import './Home.css'
import HeroImage from '../elements/HeroImage/HeroImage'
import SearchBar from '../elements/SearchBar/SearchBar'
import FourColdGrid from '../elements/FourColGrid/FourColdGrid'
import {API_KEY,API_URL,IMAGE_BASE_URL,POSTER_SIZE,BACKDROP_SIZE} from '../../config'
import MovieThumb from '../elements/MovieThumb/MovieThumb'
import Spinner from '../elements/Spinner/Spinner'
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn'



class Home extends Component {

    state={
        movies:[],
        heroImage:null,
        loading:false,
        currentPage:0,
        totalPages:0,
        searchTerm:' '
    }


    componentDidMount(){
        this.setState({loading:true})
        const endpoint=`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        this.fetchItems(endpoint)
    }

    searchItems=(searchTerm)=>{
        console.log(searchTerm);
        let endpoint = '';
        this.setState({
          movies: [],
          loading: true,
          searchTerm
        })
    
        if (searchTerm === '') {
          endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
          endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
        }
        this.fetchItems(endpoint);

        /*
        console.log(searchTerm)
        let endpoint=""
        this.setState({
            movies:[],
            loading:true,
            searchTerm
        })

        if(searchTerm===""){
            endpoint=`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        }
        else{
            endpoint=`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&query=${searchTerm}`
        }

        this.fetchItems(endpoint)

        */
    }


    loadMoreItems=()=>{
        let endpoint=''
        this.setState({loading:true})

        if(this.state.searchTerm===""){
            endpoint=`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.current.page+1}`
        }
        else{
            endpoint=`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage+1}`
        }

        this.fetchItems(endpoint)
    }


    fetchItems=(endpoint)=>{
        fetch(endpoint)
        .then(result=>result.json())
        .then(result=>{
            console.log(result)
            this.setState({
                movies:[...this.state.movies,...result.results],
                heroImage:this.state.heroImage || result.results[0],
                loading:false,
                currentPage:result.page,
                totalPages:result.total_pages
            })
        })
        .catch(error=>console.error("Error : ",error))
    }

    render(){
        return(
            <div className="rmdb-home">
                {this.state.heroImage ?
                <div>
                    <HeroImage
                        image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`} 
                        title={this.state.heroImage.original_title}
                        text={this.state.heroImage.overview}   
                    />
                    <SearchBar callback={this.searchItems}/>
                </div> :null}
                <div className="rmdb-home-grid">
                    <FourColdGrid 
                        header={this.state.searchTerm ? 'Search Result' : 'Popular'}
                        loading={this.state.loading}
                    >
                            {this.state.movies.map((element,i)=>{
                                return <MovieThumb 
                                    key={i}
                                    clickable={true}
                                    image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}/${element.poster_path}` : './images/no_image.jpg'}
                                    movieId={element.id}
                                    movieName={element.original_title}
                                />
                            })}
                        </FourColdGrid>
                
                </div>
                <Spinner />
                <LoadMoreBtn text="Load More" onClick={this.loadMoreItems}/>
            </div>
        )
    }
}

export default Home;