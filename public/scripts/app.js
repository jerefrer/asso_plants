
var AssociationBox = React.createClass({
  componentDidMount: function() {
      window.addEventListener('scroll', this.handleScroll);
      this.scrollTop = 0;
      console.log(1);
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll: function(event) {
    this.scrollTop = event.srcElement.body.scrollTop;
    var cx = React.addons.classSet;
    var classes = cx({
        'visible': true,
    })
    console.log((this.scrollTop >= 50 ? true : false));
    console.log(  event.srcElement.body.scrollTop + 'px');
  },
  getInitialState: function() {
    return {selectedPlantName: 'Tomate'};
  },
  displayAssociatedPlant: function(plantName) {
    this.setState({selectedPlantName: plantName});
  },
  render: function() {
    var associatedPlants;
    var descriptionAssociatedPlants;
    var cx = React.addons.classSet;
    var classes = cx({
        'visible': true,
    });
    if (this.state.selectedPlantName) {
      var plant = this.props.data.find({name: this.state.selectedPlantName});
      var data = this.props.data;
      associatedPlants = <AssociatedPlants good={plant.good} bad={plant.bad} data={this.props.data} onSelectedPlant={this.displayAssociatedPlant} />
      descriptionAssociatedPlants = <div className="fly-in">
                                      <section className="bg-grey associated-box">
                                        <div className="container">
                                          <div className="three columns">
                                            <div className="circle big-circle">
                                              <img src={plant.img} />
                                            </div>
                                          </div>
                                          <div className="nine columns">
                                            <h1 className="float-left fly-in">{this.state.selectedPlantName}</h1>
                                            <hr className="clearfix"/>
                                            <p> {plant.desc} </p>
                                          </div>
                                        </div>
                                      </section>
                                      <div className="triangle-illu"></div>
                                    </div>
    }
    return (
      <div className='associationBox'>
        <div className="header-box">
          <header className={classes}>
            <div className="container form">
              <SearchBar plantsNames={this.props.data.map('name')} onSelectedPlant={this.displayAssociatedPlant} />
            </div>
          </header>
        </div>
        {descriptionAssociatedPlants}
        <section className="double-top">
          {associatedPlants}
        </section>
        <div className="footer-illu double-top"></div>
        <footer>
            <h4 className="text-center text-dark-dark">Made with love</h4>
        </footer>
      </div>
    );
  }
});

var SearchBar = React.createClass({
  componentDidMount: function() {
    var that = this;
    $('#typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'vegetables',
      source: substringMatcher(this.props.plantsNames)
    })
    .on('typeahead:select', function(event, plantName) {
      that.props.onSelectedPlant(plantName);
      $('#typeahead').typeahead('val', '');
    });
  },
  render: function() {
    return (
      <div className='SearchBar'>
        <input type="text" name='vegetables' id='typeahead' placeholder="Rechercher une plante" ref="plantName" />
        <div className="search-icon">
          <img src="assets/search.svg"/>
        </div>
        <input type="submit" value=""/>
      </div>
    );
  }
});

var AssociatedPlants = React.createClass({
  displayPlantList: function(plants) {
    var that = this;
    return plants.map(function(plantName, plantImg) {
      var plantInfo = that.props.data.find({name: plantName});
      return <Plant name={plantName} img={plantInfo.img} nbFriends={plantInfo.good.length} nbEnemies={plantInfo.bad.length} onSelectedPlant={that.props.onSelectedPlant} />;
    });
  },
  render: function() {
    return(
      <div className='associatedPlants'>
        <div className="container">
          <div className="fly-in six columns">
            <div className="quad-bottom friends-icon float-left">
              <img src="assets/friends.svg"/>
            </div>
            <h3 className="quad-bottom float-left i">Amis</h3>
            <div className="clearfix"></div>
            {this.displayPlantList(this.props.good)}
          </div>
          <div className="fly-in six columns">
            <div className="quad-bottom ennemies-icon float-left">
              <img src="assets/ennemies.svg"/>
            </div>
            <h3 className="quad-bottom float-left i">Ennemies</h3>
            <div className="clearfix"></div>
            {this.displayPlantList(this.props.bad)}
          </div>
        </div>
      </div>
    );
  }
});

var Plant = React.createClass({
  selectPlant: function() {
    this.props.onSelectedPlant(this.props.name);
  },
  render: function() {
    return (
      <div className='plant-box fly-in' onClick={this.selectPlant}>
        <div className="double-top circle super-small-circle bg-white"></div>
        <div className="double-bottom">
          <div className="circle small-circle">
            <img src={this.props.img} />
          </div>
          <h4 className="text-center"> {this.props.name} </h4>
        </div>
        <div>
          <div>
            <div className="friends-icon float-left">
              <img src="assets/friends.svg"/>
            </div>
            <p className="float-left">{this.props.nbFriends}</p>
            <p className="float-right">{this.props.nbEnemies}</p>
            <div className="ennemies-icon float-right">
              <img src="assets/ennemies.svg"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

React.render(
  <AssociationBox data={window.plants} />,
  document.getElementById('content')
);
