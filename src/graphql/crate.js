
import gql from 'graphql-tag'

let fragment = {};
let query = {};
let mutation = {};


// Mutations
mutation['newCrate'] = gql`
	mutation (
		$record: CreateOneCratesInput!
	){
		crate {
			create(
				record: $record
			) {
				recordId
			}
		}
	}
`

mutation['updateCrate'] = gql`
	mutation (
		$record: UpdateByIdCratesInput!
	){
		crate {
			updateById (
				record: $record
			) {
				recordId
			}
		}
	}
`



// Queries

query['crates'] = gql`
	query (
		$filter: FilterFindManyCratesInput
	) {
		viewer {
			crate {
				many (
					filter: $filter
					sort: _ID_DESC
				) {
					_id
					type
					name
					description
					environment
					envRequirements
					universeCapabilities
					platform
					nodes
					active
					createdAt
					updatedAt
				}
			}
		}
	}
`

query['crate'] = gql`
	query (
		$_id: MongoID!
	) {
		viewer {
			crate {
				byId (
					_id: $_id
				) {
					_id
					type
					name
					description
					environment
					envRequirements
					universeCapabilities
					platform
					nodes
					active
					createdAt
					updatedAt
				}
			}
		}
	}
`

// query['crateBySlug'] = gql`
// 	query (
// 		$slug: String
// 	) {
// 		viewer {
// 			crate {
// 				one (
// 					filter: {
// 						slug: $slug
// 					}
// 				) {
// 					_id
// 					slug
// 					title
// 					schemaCode
// 					schemaObj
// 					createdAt
// 					updatedAt
// 				}
// 			}
// 		}
// 	}
// `



export default {
	query,
	mutation,
	fragment
};