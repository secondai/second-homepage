
import gql from 'graphql-tag'

let fragment = {};
let query = {};
let mutation = {};



query['me'] = gql`
query {
	viewer {
		me
	}
}
`


export default {
	query,
	mutation,
	fragment
};