require 'spec_helper.rb'

describe "Group Edit" do
  before do
    @group = create :group
    @user = create :admin
    login_helper(@user.email, @user.password)
    visit "/groups/#{@group.id}"
  end

  it 'should switch to main info edit when link is clicked', vcr: true do
    expect(page).to have_content 'Auckland'
    page.should have_selector(:link_or_button, 'Edit fields here')
  end
end
