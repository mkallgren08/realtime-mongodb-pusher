import axios from "axios";

export default {
  getTasks: function() {
    return axios.get('api/tasks')
  },
  deleteTask: function(id){
    return axios.delete('/api/articles/'+id);
  }
}