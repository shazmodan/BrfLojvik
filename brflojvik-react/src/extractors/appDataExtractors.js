import {map, filter, path, find, contains, append, sortBy, compose, prop, toLower, not, isNil, isEmpty} from 'ramda'
import {isFuture, closestIndexTo} from 'date-fns'
import slugify from 'slugify'
import {Maybe} from 'monet'

const isPageType = item => pageType => path(['sys', 'contentType', 'sys', 'id'], item) === pageType
const isInformationPage = item => isPageType(item)('informationPage')
const isParentPage = item => isPageType(item)('parentPage')
const isBoardMembersPage = item => isPageType(item)('boardMembers')
const isStartPage = item => isPageType(item)('startPage')
const isEventPage = item => isPageType(item)('event')
const isSearchPage = item => isPageType(item)('searchPage')
const isSearchPageNote = item => isPageType(item)('searchPageNote')
const isFooterPage = item => isPageType(item)('footerPage')

const hasMatchingId = id => asset => path(['sys', 'id'], asset) === id

const pageWithMatchingId = items => id => find(hasMatchingId(id), items)
const pagesWithIds = (items, ids) => {
	const pages = map(pageWithMatchingId(items), ids)
	return pages
}

const slugifyText = text => `/${slugify(text.toLowerCase())}`
const addUrlToPage = page => ({...page, url: slugifyText(page.fields.heading)})

const extractImageData = (image, assets) => {
	if (!image) {
		return null
	}

	const id = image.sys.id
	const asset = find(hasMatchingId(id), assets)

	return asset ? {
		url: asset.fields.file.url,
		height: asset.fields.file.details.image.height,
		width: asset.fields.file.details.image.width,
		alt: asset.fields.title,
	} : null
}

const extractArticleInformation = includedAssets => item => {
	const {icon, parentPage, backgroundImage, heading, 
		text, shortDescription, arrowColor} = item.fields

	const article = {
		id: item.sys.id,
		heading: heading,
		url: slugifyText(heading),
		markdownText: text,
		icon: extractImageData(icon, includedAssets),
		parentPageId: parentPage.sys.id,
		lastUpdate: item.sys.updatedAt,
		backgroundImage: extractImageData(backgroundImage, includedAssets),
		shortDescription: shortDescription,
		arrowColor: arrowColor,
	}
	return article
}

const extractBoardMemberInformation = includedAssets => item => {
	const { name, responsibility, email, photo, responsibilityType } = item.fields
	const boardMember = {
		id: path(['sys', 'id'], item),
		name: name,
		responsibility: responsibility,
		email: email,
		photo: extractImageData(photo, includedAssets),
		responsibilityType: responsibilityType,
	}
	return boardMember
}

const extractParentInformation = item => {
	const parent = {
		id: item.sys.id,
		heading: item.fields.heading,
		menuArticles: item.fields.menuArticles, 
	}
	return parent
}

const extractSubMenu = page => {
	const subMenu = {
		id: page.sys.id,
		heading: page.fields.heading,
		url: page.url,
	}
	return subMenu
}

const getMatchingArticlePage = pages => id => find(hasMatchingId(id))(pages)

const logNilPages = pages => pages.filter(isNil).map(page => console.error('Found a nil page: ', page))
	
const matchPages = pages => parent => {
	const subMenuIds = map(x => x.sys.id)(parent.menuArticles)
	const matchingPages = map(getMatchingArticlePage(pages))(subMenuIds)
	const existingMatchingPages = matchingPages.filter(page => not(isNil(page)))
	logNilPages(matchingPages)
	return {
		heading: parent.heading,
		subMenuItems: map(extractSubMenu, existingMatchingPages),
	}
}

const getSearchPageNotes = jsonData => filter(isSearchPageNote, jsonData.items)
const getSearchPage = jsonData => find(isSearchPage, jsonData.items)
const getBoardMembersPage = jsonData => find(isBoardMembersPage, jsonData.items)
const getArticlePages = jsonData => filter(isInformationPage, jsonData.items)
const getMenuPages = jsonData => {
	const articlePages = getArticlePages(jsonData)
	const boardMembersPage = getBoardMembersPage(jsonData)

	const pages = append(boardMembersPage, articlePages)
	const pagesWithUrl = map(addUrlToPage, pages)
	return pagesWithUrl
}

const sortByHeading= sortBy(compose(toLower, prop('heading')))
export const getMenuData = (parents, pages) => sortByHeading(map(matchPages(pages), parents))

export const getArticles = jsonData => {
	const informationPages = filter(isInformationPage, jsonData.items)
	const articles = map(extractArticleInformation(jsonData.includes.Asset), informationPages)
	return articles
}

export const getParents = jsonData => {
	const parentPages = filter(isParentPage, jsonData.items)
	const parents = map(extractParentInformation, parentPages)
	return parents
}

export const getBoardMembers = jsonData => {
	const boardMembersPage = getBoardMembersPage(jsonData)
	const activeBoardMemberIds = map(x => x.sys.id, boardMembersPage.fields.activeBoardMembers)
	const activeBoardMemberPages = pagesWithIds(jsonData.items, activeBoardMemberIds)
	const activeBoardMembers = map(extractBoardMemberInformation(jsonData.includes.Asset), activeBoardMemberPages)
	return activeBoardMembers
}

export const getBoardMembersData = jsonData => {
	const boardMembersPage = getBoardMembersPage(jsonData)
	const { heading, redSubHeading, text } = boardMembersPage.fields
	const boardMembers = getBoardMembers(jsonData)
	const boardMembersData = {
		url: slugifyText(heading),
		heading: heading,
		redSubHeading: redSubHeading,
		text: text,
		activeBoardMembers: boardMembers,
	}
	
	return boardMembersData
}

const extractNavigationLinkData = page => {
	const navigationLinkData = {
		id: page.sys.id,
		heading: page.fields.heading,
		url: slugifyText(page.fields.heading),
	}
	return navigationLinkData
}

export const getClosestUpcomingEvent = (closestToDate, jsonData) => {
	const eventPages = filter(isEventPage, jsonData.items)
	const upcomingEvents = filter(event => isFuture(event.fields.date), eventPages)
	const futureEventDates = map(event => event.fields.date, upcomingEvents)
	if (futureEventDates.length === 0) {
		return null
	}

	const closestUpcomingEventIndex = closestIndexTo(closestToDate, futureEventDates)
	const closestUpcomingEvent = upcomingEvents[closestUpcomingEventIndex].fields

	return closestUpcomingEvent
}

export const getStartPage = jsonData => find(isStartPage, jsonData.items)

export const extractGoodToKnowData = jsonData => goodToKnowItem => {
	const id = goodToKnowItem.sys.id
	const page = find(hasMatchingId(id), jsonData.items)
 
	const {icon, heading, shortDescription, arrowColor} = page.fields
	const goodToKnowData = {
		url: slugifyText(heading),
		heading: heading,
		text: shortDescription || '',
		icon: extractImageData(icon, jsonData.includes.Asset),
		arrowColor: arrowColor,
	}

	return goodToKnowData
}

const extractSlideshowData = jsonData => slideShowItem => {
	const slideShowItemData = extractImageData(slideShowItem, jsonData.includes.Asset)
	slideShowItemData.id = slideShowItem.sys.id

	return slideShowItemData
}

export const getSearchPageNotesData = jsonData => {
	const searchPageNotes = getSearchPageNotes(jsonData)
	const notes = map(note => ({
		id: path(['sys', 'id'], note),
		heading: note.fields.heading,
		description: note.fields.description
	}), searchPageNotes)

	return notes
}

export const getSearchPageData = jsonData => {
	const searchPage = getSearchPage(jsonData)
	const searchPageData = {
		heading: searchPage.fields.heading,
		url: slugifyText(searchPage.fields.heading),
		description: searchPage.fields.description,
		notes: getSearchPageNotesData(jsonData),
	}

	return searchPageData
}

export const getStartPageData = jsonData => {
	const startPage = getStartPage(jsonData)
	const { navigationLinks, goodToKnowLinks, slideshow, topNewsHeading, topNewsText, topNewsLink } = startPage.fields

	const navigationLinksIds = map(x => x.sys.id, navigationLinks)
	const navigationLinksPages = filter(page => contains(page.sys.id, navigationLinksIds), jsonData.items)
	const navigationLinksData = map(extractNavigationLinkData, navigationLinksPages)
	const event = getClosestUpcomingEvent(Date.now(), jsonData)
	const startPageData = {
		navigationLinks: navigationLinksData,
		nextEvent: event,
		goodToKnowItems: map(extractGoodToKnowData(jsonData), goodToKnowLinks),
		slideshow: map(extractSlideshowData(jsonData), slideshow),
		searchPageData: getSearchPageData(jsonData),
		topNewsHeading: topNewsHeading,
		topNewsText: topNewsText,
		topNewsLink: Maybe.fromNull(topNewsLink)
			.chain(link => Maybe.fromNull(link.sys.id))
			.map(pageWithMatchingId(jsonData.items))
			.map(page => page.fields.heading)
			.fold('')(slugifyText)
	}

	return startPageData
}

const extractFooterData = footerPage => ({
	leftHeading: footerPage.fields.leftHeading,
	leftText: footerPage.fields.leftText,
	rightHeading: footerPage.fields.rightHeading,
	rightText: footerPage.fields.rightText,
})

const defaultFooterData = () => ({
	leftHeading: 'Adresser',
	leftText: 'Kommer snart.',
	rightHeading: 'Kontakt',
	rightText: 'Kommer snart.'
})

// getFooterPage :: A -> Either
const getFooterPage = jsonData => Maybe.fromNull(find(isFooterPage, jsonData.items))
	.toEither('Cant find footerPage')

// getFooterData :: A -> B
export const getFooterData = jsonData => getFooterPage(jsonData)
	.cata(defaultFooterData, extractFooterData)

	
//TODO: Calendar page, is just an aggregate of events, hard coded url.

export const extractAppData = jsonData => {
	const parents = getParents(jsonData)
	const articles = getArticles(jsonData)
	const menuPages = getMenuPages(jsonData)
	const menuData = getMenuData(parents, menuPages)
	const boardMembersData = getBoardMembersData(jsonData)
	const searchPageData = getSearchPageData(jsonData)
	const startPageData = getStartPageData(jsonData)
	const footerData = getFooterData(jsonData)

	const appData = {
		parents,
		articles,
		menuData,
		boardMembersData,
		searchPageData,
		startPageData,
		footerData,
	}

	return appData
}

