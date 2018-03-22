
import gql from 'graphql-tag'

let fragment = {};
let query = {};
let mutation = {};


// Mutations
mutation['addNode'] = gql`
	mutation (
		$record: JSON
	){
		node {
			add(
				record: $record
			)
		}
	}
`

mutation['newNode'] = gql`
	mutation (
		$record: CreateOneNodesInput!
	){
		node {
			create(
				record: $record
			) {
				recordId
			}
		}
	}
`

mutation['updateNode'] = gql`
	mutation (
		$record: UpdateByIdNodesInput!
	){
		node {
			updateById (
				record: $record
			) {
				recordId
			}
		}
	}
`



// Queries


query['nodes'] = gql`
	query (
		$filter: FilterFindManyNodesInput
		$limit: Int
	) {
		viewer {
			node {
				many (
					filter: $filter
					limit: $limit
					sort: _ID_DESC
				) {
					_id
					package
					signature
					nonce
					author

					ref
					version
					ipfsHash
					type
					nodeId
					data

					ipfsHashForThisNode

					createdAt
				}
			}
		}
	}
`

query['node'] = gql`
	query (
		$_id: MongoID!
	) {
		viewer {
			node {
				byId (
					_id: $_id
				) {
					_id
					package
					signature
					nonce

					author

					ref
					version
					ipfsHash
					type
					nodeId
					data

					ipfsHashForThisNode

					createdAt
				}
			}
		}
	}
`


query['nodeByUuid'] = gql`
	query (
		$uuid: String
	) {
		viewer {
			node {
				one (
					filter: {
						uuid: $uuid
					}
				) {
					_id
					package
					signature
					nonce
					author

					ref
					version
					ipfsHash
					type
					nodeId
					data

					ipfsHashForThisNode

					createdAt
				}
			}
		}
	}
`



export default {
	query,
	mutation,
	fragment
};