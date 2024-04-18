import {demoData} from './demoData'
import {
	getArticles, 
	getParents, 
	getMenuData,
	getBoardMembers,
	getBoardMembersData,
	getClosestUpcomingEvent,
	getStartPageData,
	getSearchPageData,
	getSearchPageNotesData,
	getFooterData, 
} from '../appDataExtractors'
import {isNil, isEmpty, compose, where, either, not, T, equals, all, curry} from 'ramda'
import {isAfter} from 'date-fns'

const isNotNil = compose(not, isNil)
const isNilOrEmpty = either(isNil, isEmpty)
const isNotNilOrEmpty = compose(not, isNilOrEmpty)
const isValidIcon = where({
	url: isNotNilOrEmpty,
	width: isNotNilOrEmpty,
	height: isNotNilOrEmpty,
	alt: T,
})
const isNilOrValidIcon = either(equals(null), isValidIcon)

const isValidArticle = where({
	id: isNotNilOrEmpty,
	heading: isNotNilOrEmpty,
	url: isNotNilOrEmpty,
	markdownText: isNotNilOrEmpty,
	icon: isNilOrValidIcon,
	parentPageId: isNotNilOrEmpty,
	lastUpdate: isNotNilOrEmpty,
})

const isValidParent = where({
	id: isNotNilOrEmpty,
	heading: isNotNilOrEmpty, 
})

const isValidBoardMember = where({
	id: isNotNilOrEmpty,
	name: isNotNilOrEmpty,
	responsibility: isNotNilOrEmpty,
	email: isNotNilOrEmpty,
	photo: isNilOrValidIcon,
	responsibilityType: isNotNilOrEmpty,
})

describe('getArticles', () => {
	it('should only return an array of valid articles', () => {
		const articles = getArticles(demoData)
		const articlesAreValid = all(isValidArticle, articles)

		expect(articlesAreValid).toBe(true)
	})
})

describe('getParents', () => {
	it('should only return an array of valid parents', () => {
		const parents = getParents(demoData)
		const parentsAreValid = all(isValidParent, parents)

		expect(parentsAreValid).toBe(true)
	})
})

describe('getMenuData', () => {
	it('should return menuData', () => {
		const parents = [
			{id: 'a', heading: 'Parent1', menuArticles: [{ $ref: '$1' }]},
			{id: 'b', heading: 'Parent2', menuArticles: [{ $ref: '$2' }, { $ref: '$3' }]},
		]
		const articles = [
			{sys: { id: '$1' }, heading: 'article1', parentPage: { $ref: 'a' }, url: '/article1'},
			{sys: { id: '$2' }, heading: 'article2', parentPage: { $ref: 'b' }, url: '/article2'},
			{sys: { id: '$3' }, heading: 'article3', parentPage: { $ref: 'b' }, url: '/article3'},
		]

		const actual = getMenuData(parents, articles)
		const expected = [
			{
				heading: 'Parent1',
				subMenuItems: [
					{
						id: '$1', 
						heading: 'article1',
						url: '/article1',
					},
				]
			}, 
			{
				heading: 'Parent2',
				subMenuItems: [
					{
						id: '$2', 
						heading: 'article2',
						url: '/article2',
					},
					{
						id: '$3', 
						heading: 'article3',
						url: '/article3',
					},
				]
			}
		]

		expect(actual).toEqual(expected)
	})
})

describe('getBoardMembers', () => {
	it('should return five board members', () => {
		const boardMembers = getBoardMembers(demoData)
		const boardMembersAreValid = all(isValidBoardMember, boardMembers)

		expect(boardMembersAreValid).toBe(true)
	})
})

const isValidBoardMembersData = where({
	url: isNotNilOrEmpty,
	heading: isNotNilOrEmpty,
	redSubHeading: isNotNilOrEmpty,
	text: isNotNilOrEmpty,
	activeBoardMembers: all(isValidBoardMember),
})

describe('getBoardMembersData', () => {
	it('should return boardMembersData', () => {
		const boardMembersData = getBoardMembersData(demoData)
		const boardMembersDataIsValid = isValidBoardMembersData(boardMembersData)
		
		expect(boardMembersDataIsValid).toBe(true)
	})
})

const curriedIsAfter = today => date => isAfter(date, today)

const isValidEventData = today => where({
	heading: isNotNilOrEmpty,
	date: curriedIsAfter(today),
	description: isNotNilOrEmpty,
})

describe('getClosestUpcomingEvent', () => {
	it('should return the event in the future that is closest to today', () => {
		const today = Date.parse('2017-12-13')
		const actual = getClosestUpcomingEvent(today, demoData)
		const eventIsValid = isValidEventData(today)(actual)

		expect(eventIsValid).toBe(true)
	})
})

const isValidNavigationLink = where({
	id: isNotNilOrEmpty,
	heading: isNotNilOrEmpty,
	url: isNotNilOrEmpty,
})

const isValidGoodToKnowItem = where({
	url: isNotNilOrEmpty,
	heading: isNotNilOrEmpty,
	text: isNotNilOrEmpty,
	icon: where({
		url: isNotNilOrEmpty,
		width: isNotNilOrEmpty,
		height: isNotNilOrEmpty,
		alt: isNotNilOrEmpty,
	}),
})

const isValidSlideshowItem = where({
	id: isNotNilOrEmpty,
	url: isNotNilOrEmpty,
	width: isNotNilOrEmpty,
	height: isNotNilOrEmpty,	
})

const isValidStartPageData = where({
	navigationLinks: all(isValidNavigationLink),
	nextEvent: isNotNilOrEmpty,
	goodToKnowItems: all(isValidGoodToKnowItem),
	slideshow: all(isValidSlideshowItem),
	searchPageData: where({
		heading: isNotNilOrEmpty,
		description: isNotNilOrEmpty,
		url: isNotNilOrEmpty,
	}),
	topNewsHeading: isNotNilOrEmpty,
	topNewsText: isNotNilOrEmpty,
	topNewsLink: isNotNil,
})

describe('getStartPageData', () => {
	it('should return startPageData', () => {
		const actual = getStartPageData(demoData)
		const startPageDataIsValid = isValidStartPageData(actual)

		expect(startPageDataIsValid).toBe(true)
	})
})

const isValidSearchPageNotesData = all(where({
	id: isNotNilOrEmpty,
	heading: isNotNilOrEmpty,
	description: isNotNilOrEmpty,
}))

const isValidSearchPageData = where({
	heading: isNotNilOrEmpty,
	url: isNotNilOrEmpty,
	description: isNotNilOrEmpty,
	notes: isValidSearchPageNotesData,
})

describe('getSearchPageData', () => {
	it('should return searchPageData', () => {
		const actual = getSearchPageData(demoData)
		const searchPageDataIsValid = isValidSearchPageData(actual)

		expect(searchPageDataIsValid).toBe(true)
	})
})


const isValidFooterPageData = where({
	leftHeading: isNotNilOrEmpty,
	leftText: isNotNilOrEmpty,
	rightHeading: isNotNilOrEmpty,
	rightText: isNotNilOrEmpty,
})

describe('getFooter', () => {
	it('should return footerPageData', () => {
		const actual = getFooterData(demoData)
		const footerPageDataIsValid = isValidFooterPageData(actual)
		
		expect(footerPageDataIsValid).toBe(true)
	})
})