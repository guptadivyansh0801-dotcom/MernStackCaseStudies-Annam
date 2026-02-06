// Code Walkthrough - IoC Containers with TypeDI
// Note: This requires installing typedi and reflect-metadata
// npm install typedi reflect-metadata

// tsconfig.json needs:
// "experimentalDecorators": true,
// "emitDecoratorMetadata": true

// Entry file needs: import "reflect-metadata";

// Code Walkthrough - Interface Definition
interface NewsSource {
    fetchArticles(): Promise<string[]>;
}

// Code Walkthrough - RSSFeedSource Implementation
// @Service()
class RSSFeedSource implements NewsSource {
    async fetchArticles(): Promise<string[]> {
        return ["RSS: Article 1", "RSS: Article 2"];
    }
}

// Code Walkthrough - APISource Implementation
// @Service()
class APISource implements NewsSource {
    async fetchArticles(): Promise<string[]> {
        return ["API: Article A", "API: Article B"];
    }
}

// Code Walkthrough - NewsAggregator with Injection
// @Service()
class NewsAggregator {
    constructor(private source: NewsSource) { }

    async getLatestArticles() {
        const articles = await this.source.fetchArticles();
        articles.forEach(article => console.log(article));
    }
}

// Code Walkthrough - Usage without IoC container (manual DI)
const rssSource = new RSSFeedSource();
const aggregator1 = new NewsAggregator(rssSource);
aggregator1.getLatestArticles();

// Code Walkthrough - Swapping Implementation
const apiSource = new APISource();
const aggregator2 = new NewsAggregator(apiSource);
aggregator2.getLatestArticles();

// Challenge: Mock Source for Testing
class MockNewsSource implements NewsSource {
    async fetchArticles(): Promise<string[]> {
        return ["Mock: Test Article 1", "Mock: Test Article 2"];
    }
}

const mockSource = new MockNewsSource();
const testAggregator = new NewsAggregator(mockSource);
testAggregator.getLatestArticles();

console.log("IoC Container concepts demonstrated with manual DI pattern");
