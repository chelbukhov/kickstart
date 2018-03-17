/* 
на странице отображается список всех открытых кампаний
по сбору средств
*/
import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    // функция инициализации, из Next.js
    // используется ключевое слово static
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }


    // отрисовка списка кампаний, вставленного в "ui card"
    // библиотеки semantic-ui-react
    //ниже в route=... reиспользуются фигурные скобки и ОБРАТНЫЕ кавычки
    renderCanpaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                <Link route={`/campaigns/${address}`}> 
                    <a>View Campaign</a>
                </Link>
                ),
                fluid: true  // свойство "жидкость" отвечает за растяжение по ширине контейнера
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return <Layout>
            <div>
              <h3>Open Campaigns</h3>
              <Link route="/campaigns/new">
                <a>
                    <Button 
                        floated="right" 
                        content="Create Campaign" 
                        icon="add circle" 
                        primary 
                        />
                </a>
              </Link>
              {this.renderCanpaigns()}
            </div>
          </Layout>;
    }
}


export default CampaignIndex;