# bgg-api-to-json

I created this package as a way to get clean, strongly-typed, JSON-formatted data from the [BGG XML API2](https://boardgamegeek.com/wiki/page/BGG_XML_API2). It also relies on the original BGG API for geeklist support which is currently unavaiable in BGG's XML API2.

## Installation

Run the following script to install the api into your project.

`npm i bgg-api-to-json`

Then import it using:

`import bggApiToJson from 'bgg-api-to-json';`

## Usage

The `bggApiToJson` object has the following methods corresponding to the similarly named bgg "things":

- collection
- family
- forum
- geeklist
- guild
- hot
- plays
- search
- thing
- thread
- user

Each one returns a promise that resolves to a JSON with the returned data. The `bggApiToJson` object also contains pascal-cased types for these response JSON as well as the request options JSON that each method takes as a parameter, named `[BggThingName]Response` and `[BggThingName]Options` respectively.

(e.g., if you wanted the type definition for the response from the user method, you would import `UserResponse`.)

For more information on the structure and type definitions of each method's parameters and returns, see the wiki. (coming soon)
