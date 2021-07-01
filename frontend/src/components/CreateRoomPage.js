import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio  from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { ClickAwayListener, Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";


export default class CreateRoomPage extends Component{
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update:null,
        roomCode:null,
        updateCallback:()=>{}
    }

   constructor(props){
       super(props)
       this.state = {
           guestCanPause: this.props.guestCanPause,
           votesToSkip: this.props.votesToSkip,
           errorMessage: "",
           successMessage:"",
       }
       this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
       this.handleVotesChange = this.handleVotesChange.bind(this);
       this.handleRoomButtomPressed = this.handleRoomButtomPressed.bind(this);
       this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
   }
   handleVotesChange(e){
       this.setState({
           votesToSkip: e.target.value
       });
   }
   handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause: e.target.value === 'true' ? true : false,
        })
   }
   handleRoomButtomPressed(){
        const requestOptions = {
            method:'POST',
            headers:{'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        fetch('/api/create-room', requestOptions)
        .then((response) => response.json())
        .then((data) => this.props.history.push("/room/" + data.code))
   }
   handleUpdateButtonPressed(){
    const requestOptions = {
        method:'PATCH',
        headers:{'Content-Type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            votes_to_skip: this.state.votesToSkip,
            guest_can_pause: this.state.guestCanPause,
            code: this.props.roomCode
        }),
    };
    fetch('/api/update-room', requestOptions)
        .then((response) => {
            if(response.ok){
                this.setState({
                    successMessage:"Room Updated Successfully"
                });
            }
            else{
                this.setState({
                    errorMessage:"Error updating room...."
                });
            }
            this.props.updateCallback();
        });
        
   }
   renderCreateButtons(){
       return(
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleRoomButtomPressed}>
                    Create A Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    )
   }
   renderUpdateButtons(){
        return(
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        )
   }
   render(){
       const title = this.props.update ? "Update Room:" : "Create A Room"
       return(
           <Grid container spacing={1}>
               <Grid item xs={12} align="center">
                   <Collapse in={ this.state.errorMessage != "" || this.state.successMessage != ""}>
                       {this.state.successMessage != "" ? (<Alert severity="success" onClose={() => {this.setState({successMessage:""})}}>{this.state.successMessage}</Alert>): (<Alert severity="error" onClose={() => this.setState({errorMessage:""})}>{this.state.errorMessage}</Alert>)  }
                   </Collapse>
               </Grid>
               <Grid item xs={12} align="center">
                   <Typography component='h4' variant='h4'>
                       {title}
                   </Typography>
               </Grid>
               <Grid item xs={12} align="center">
                   <FormControl component="fieldset">
                       <FormHelperText>
                           <div align="center">
                                Guest Control of Playback State
                           </div>
                       </FormHelperText>
                       <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel value="true" 
                                control={<Radio color="primary"/>}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel value="false" 
                                control={<Radio color="secondary"/>}
                                label="No control"
                                labelPlacement="bottom"
                            />
                       </RadioGroup>
                   </FormControl>
               </Grid>
               <Grid item xs={12} align="center">
                   <FormControl>
                       <TextField 
                            onChange={this.handleVotesChange}
                            required={true} type="number" 
                            defaultValue={this.state.votesToSkip} 
                            inputProps={{
                                min:1,
                                style:{textAlign:"center"}
                            }}
                            />
                       <FormHelperText>
                           <div align="center">
                               Votes Required to Skip
                           </div>
                       </FormHelperText>
                   </FormControl>
               </Grid>
               {this.props.update ? this.renderUpdateButtons(): this.renderCreateButtons()}
           </Grid>
       )
   }
}